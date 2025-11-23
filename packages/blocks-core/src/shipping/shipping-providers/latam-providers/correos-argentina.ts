/**
 * Correos Argentina shipping provider example
 * This is an example implementation showing how to integrate with Correos Argentina API
 */

import { APIProviderAdapter, type APIProviderAdapterOptions } from '../api-provider-adapter';
import type { ShippingOption } from '../../types';

/**
 * Correos Argentina provider options
 */
export interface CorreosArgentinaOptions {
  /**
   * API key for Correos Argentina
   */
  apiKey: string;
  
  /**
   * API base URL (default: https://api.correos.com.ar)
   */
  apiBaseUrl?: string;
  
  /**
   * Currency (default: ARS)
   */
  currency?: string;
}

/**
 * Create Correos Argentina shipping provider
 */
export function createCorreosArgentinaProvider(options: CorreosArgentinaOptions): APIProviderAdapter {
  const currency = options.currency || 'ARS';
  const adapterOptions: APIProviderAdapterOptions = {
    name: 'Correos Argentina',
    apiBaseUrl: options.apiBaseUrl || 'https://api.correos.com.ar',
    apiKey: options.apiKey,
    transformRequest: (request) => {
      // Transform to Correos Argentina API format
      return {
        destino: {
          calle: request.address.street,
          numero: request.address.streetNumber,
          piso: request.address.apartment,
          localidad: request.address.city,
          provincia: request.address.province || request.address.state,
          codigoPostal: request.address.postalCode,
          pais: request.address.country,
        },
        paquetes: request.items.map((item) => ({
          peso: item.weight || 1, // Default 1kg if not specified
          dimensiones: item.dimensions
            ? {
                largo: item.dimensions.length || 10,
                ancho: item.dimensions.width || 10,
                alto: item.dimensions.height || 10,
              }
            : undefined,
          cantidad: item.quantity,
          valor: item.value || 0,
        })),
      };
    },
    transformResponse: (response) => {
      // Transform Correos Argentina response to ShippingCalculationResult
      const resp = response as {
        opciones?: Array<{
          tipo: string;
          nombre: string;
          costo: number;
          diasEstimados: { min: number; max: number };
        }>;
        error?: string;
      };

      if (resp.error) {
        return {
          rates: [],
          errors: [{ field: 'api', message: resp.error }],
        };
      }

      const rates = (resp.opciones || []).map((opcion) => ({
        option: {
          id: opcion.tipo,
          name: opcion.nombre,
          type: opcion.tipo as ShippingOption['type'],
          estimatedDays: opcion.diasEstimados,
        },
        cost: opcion.costo,
        currency: currency,
        estimatedDays: opcion.diasEstimados,
      }));

      return { rates };
    },
    validateAddressApi: async (address) => {
      // Validate address via Correos Argentina API
      try {
        const response = await fetch(
          `${options.apiBaseUrl || 'https://api.correos.com.ar'}/validar-direccion`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${options.apiKey}`,
            },
            body: JSON.stringify({
              codigoPostal: address.postalCode,
              localidad: address.city,
              provincia: address.province || address.state,
            }),
          }
        );

        if (!response.ok) {
          return {
            valid: false,
            errors: [{ field: 'address', message: 'Invalid address' }],
          };
        }

        const data = await response.json();
        return {
          valid: data.valido === true,
          normalized: data.direccionNormalizada
            ? {
                ...address,
                street: data.direccionNormalizada.calle || address.street,
                streetNumber: data.direccionNormalizada.numero || address.streetNumber,
                city: data.direccionNormalizada.localidad || address.city,
                province: data.direccionNormalizada.provincia || address.province,
                postalCode: data.direccionNormalizada.codigoPostal || address.postalCode,
              }
            : undefined,
          errors: data.errores,
        };
      } catch (error) {
        return {
          valid: false,
          errors: [
            {
              field: 'validation',
              message: error instanceof Error ? error.message : 'Failed to validate address',
            },
          ],
        };
      }
    },
    options: [
      {
        id: 'estandar',
        name: 'Envío Estándar',
        type: 'standard',
        estimatedDays: { min: 5, max: 10 },
        description: 'Envío estándar por Correos Argentina',
      },
      {
        id: 'express',
        name: 'Envío Express',
        type: 'express',
        estimatedDays: { min: 2, max: 4 },
        description: 'Envío express por Correos Argentina',
      },
    ],
  };

  return new APIProviderAdapter(adapterOptions);
}





