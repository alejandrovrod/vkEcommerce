/**
 * Andreani shipping provider for Argentina
 * Example implementation for Andreani API integration
 */

import { APIProviderAdapter, type APIProviderAdapterOptions } from '../api-provider-adapter';
import type { ShippingOption, ShippingCalculationRequest } from '../../types';

/**
 * Andreani provider options
 */
export interface AndreaniOptions {
  /**
   * API key for Andreani
   */
  apiKey: string;
  
  /**
   * API base URL (default: https://api.andreani.com)
   */
  apiBaseUrl?: string;
  
  /**
   * Currency (default: ARS)
   */
  currency?: string;
}

/**
 * Create Andreani shipping provider
 */
export function createAndreaniProvider(options: AndreaniOptions): APIProviderAdapter {
  const adapterOptions: APIProviderAdapterOptions = {
    name: 'Andreani',
    apiBaseUrl: options.apiBaseUrl || 'https://api.andreani.com/v2/tarifas',
    apiKey: options.apiKey,
    headers: {
      'Authorization': `Bearer ${options.apiKey}`,
      'Content-Type': 'application/json',
    },
    transformRequest: (request: ShippingCalculationRequest) => ({
      origen: {
        codigoPostal: request.address.postalCode,
        localidad: request.address.city,
      },
      destino: {
        codigoPostal: request.address.postalCode,
        localidad: request.address.city,
      },
      paquetes: request.items.map((item) => ({
        peso: item.weight || 1,
        valorDeclarado: item.value,
        cantidad: item.quantity,
      })),
    }),
    transformResponse: (response: any) => ({
      rates: response.tarifas?.map((tarifa: any) => ({
        option: {
          id: `andreani-${tarifa.tipo}`,
          name: `Andreani ${tarifa.tipo}`,
          type: 'standard' as const,
          estimatedDays: typeof tarifa.plazoEntrega === 'number' 
            ? { min: tarifa.plazoEntrega, max: tarifa.plazoEntrega }
            : tarifa.plazoEntrega,
          description: tarifa.descripcion,
        },
        cost: tarifa.precio,
        currency: options.currency || 'ARS',
      })) || [],
      errors: response.errores || [],
    }),
  };

  return new APIProviderAdapter(adapterOptions);
}

/**
 * Pre-configured Andreani shipping options
 */
export const andreaniShippingOptions: ShippingOption[] = [
  {
    id: 'andreani-estandar',
    name: 'Andreani Estándar',
    type: 'standard',
    description: 'Envío estándar a domicilio',
    estimatedDays: { min: 5, max: 7 },
  },
  {
    id: 'andreani-express',
    name: 'Andreani Express',
    type: 'express',
    description: 'Envío express a domicilio',
    estimatedDays: { min: 2, max: 3 },
  },
  {
    id: 'andreani-sucursal',
    name: 'Andreani Sucursal',
    type: 'pickup',
    description: 'Retiro en sucursal',
    estimatedDays: { min: 3, max: 5 },
  },
];






