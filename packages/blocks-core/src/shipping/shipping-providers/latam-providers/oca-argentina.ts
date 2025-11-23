/**
 * OCA Argentina shipping provider example
 */

import { APIProviderAdapter, type APIProviderAdapterOptions } from '../api-provider-adapter';
import type { ShippingOption } from '../../types';

/**
 * OCA Argentina provider options
 */
export interface OCAArgentinaOptions {
  apiKey: string;
  apiBaseUrl?: string;
  currency?: string;
}

/**
 * Create OCA Argentina shipping provider
 */
export function createOCAArgentinaProvider(options: OCAArgentinaOptions): APIProviderAdapter {
  const adapterOptions: APIProviderAdapterOptions = {
    name: 'OCA Argentina',
    apiBaseUrl: options.apiBaseUrl || 'https://api.oca.com.ar',
    apiKey: options.apiKey,
    transformRequest: (request) => ({
      destino: {
        calle: request.address.street,
        numero: request.address.streetNumber,
        piso: request.address.apartment,
        localidad: request.address.city,
        provincia: request.address.province || request.address.state,
        codigoPostal: request.address.postalCode,
      },
      bultos: request.items.map((item) => ({
        peso: item.weight || 1,
        volumen: item.dimensions
          ? (item.dimensions.length || 10) * (item.dimensions.width || 10) * (item.dimensions.height || 10)
          : 1000,
        cantidad: item.quantity,
      })),
    }),
    transformResponse: (response) => {
      const resp = response as {
        servicios?: Array<{
          codigo: string;
          descripcion: string;
          precio: number;
          plazo: { minimo: number; maximo: number };
        }>;
      };

      const rates = (resp.servicios || []).map((servicio) => ({
        option: {
          id: servicio.codigo,
          name: servicio.descripcion,
          type: 'standard' as ShippingOption['type'],
          estimatedDays: {
            min: servicio.plazo.minimo,
            max: servicio.plazo.maximo,
          },
        },
        cost: servicio.precio,
        currency: options.currency || 'ARS',
        estimatedDays: {
          min: servicio.plazo.minimo,
          max: servicio.plazo.maximo,
        },
      }));

      return { rates };
    },
    options: [
      {
        id: 'oca-estandar',
        name: 'OCA Estándar',
        type: 'standard',
        estimatedDays: { min: 3, max: 7 },
      },
      {
        id: 'oca-express',
        name: 'OCA Express',
        type: 'express',
        estimatedDays: { min: 1, max: 3 },
      },
    ],
  };

  return new APIProviderAdapter(adapterOptions);
}





