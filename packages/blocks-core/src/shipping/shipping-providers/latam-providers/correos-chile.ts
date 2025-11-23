/**
 * Correos Chile shipping provider example
 */

import { APIProviderAdapter, type APIProviderAdapterOptions } from '../api-provider-adapter';
import type { ShippingOption } from '../../types';

/**
 * Correos Chile provider options
 */
export interface CorreosChileOptions {
  apiKey: string;
  apiBaseUrl?: string;
  currency?: string;
}

/**
 * Create Correos Chile shipping provider
 */
export function createCorreosChileProvider(options: CorreosChileOptions): APIProviderAdapter {
  const adapterOptions: APIProviderAdapterOptions = {
    name: 'Correos Chile',
    apiBaseUrl: options.apiBaseUrl || 'https://api.correos.cl',
    apiKey: options.apiKey,
    transformRequest: (request) => ({
      destino: {
        calle: request.address.street,
        numero: request.address.streetNumber,
        comuna: request.address.city,
        region: request.address.state || request.address.province,
        codigoPostal: request.address.postalCode,
        pais: request.address.country,
      },
      paquetes: request.items.map((item) => ({
        peso: item.weight || 1,
        dimensiones: item.dimensions
          ? {
              largo: item.dimensions.length || 10,
              ancho: item.dimensions.width || 10,
              alto: item.dimensions.height || 10,
            }
          : undefined,
        cantidad: item.quantity,
      })),
    }),
    transformResponse: (response) => {
      const resp = response as {
        opciones?: Array<{
          tipo: string;
          nombre: string;
          costo: number;
          diasEstimados: { min: number; max: number };
        }>;
      };

      const rates = (resp.opciones || []).map((opcion) => ({
        option: {
          id: opcion.tipo,
          name: opcion.nombre,
          type: opcion.tipo as ShippingOption['type'],
          estimatedDays: opcion.diasEstimados,
        },
        cost: opcion.costo,
        currency: options.currency || 'CLP',
        estimatedDays: opcion.diasEstimados,
      }));

      return { rates };
    },
    options: [
      {
        id: 'estandar',
        name: 'Envío Estándar',
        type: 'standard',
        estimatedDays: { min: 3, max: 7 },
      },
      {
        id: 'express',
        name: 'Envío Express',
        type: 'express',
        estimatedDays: { min: 1, max: 3 },
      },
    ],
  };

  return new APIProviderAdapter(adapterOptions);
}





