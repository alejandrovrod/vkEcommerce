/**
 * DHL LATAM shipping provider
 * Example implementation for DHL API integration across LATAM countries
 */

import { APIProviderAdapter, type APIProviderAdapterOptions } from '../api-provider-adapter';
import type { ShippingOption } from '../../types';

/**
 * DHL LATAM provider options
 */
export interface DHLLatamOptions {
  /**
   * DHL API credentials
   */
  siteId: string;
  password: string;
  
  /**
   * API base URL (default: https://wsbexpress.dhl.com)
   */
  apiBaseUrl?: string;
  
  /**
   * Currency (default: USD)
   */
  currency?: string;
  
  /**
   * Account number
   */
  accountNumber?: string;
}

/**
 * Create DHL LATAM shipping provider
 */
export function createDHLLatamProvider(options: DHLLatamOptions): APIProviderAdapter {
  const adapterOptions: APIProviderAdapterOptions = {
    name: 'DHL LATAM',
    apiBaseUrl: options.apiBaseUrl || 'https://wsbexpress.dhl.com/rest/sndpt/RateRequest',
    apiKey: options.password,
    headers: {
      'Content-Type': 'application/json',
    },
    transformRequest: (request) => {
      const address = request.address;
      return {
        RateRequest: {
          ClientDetails: {
            AccountNumber: options.accountNumber || '',
          },
          RequestedShipment: {
            DropOffType: 'REGULAR_PICKUP',
            ShipTimestamp: new Date().toISOString(),
            UnitOfMeasurement: 'SI',
            Content: 'DOCUMENTS',
            PaymentInfo: 'DAP',
            Ship: {
              Shipper: {
                City: address.city,
                PostalCode: address.postalCode,
                CountryCode: address.country,
              },
              Recipient: {
                City: address.city,
                PostalCode: address.postalCode,
                CountryCode: address.country,
              },
            },
            Packages: {
              RequestedPackages: request.items.map(item => ({
                Weight: item.weight || 1,
                Dimensions: {
                  Length: 10,
                  Width: 10,
                  Height: 10,
                },
              })),
            },
          },
        },
      };
    },
    transformResponse: (response: any) => {
      const products = response.RateResponse?.Provider?.[0]?.Service || [];
      const deliveryTime = response.RateResponse?.Provider?.[0]?.Service?.[0]?.DeliveryTime || 5;
      return {
        rates: products.map((service: any) => ({
          option: {
            id: `dhl-${service.GlobalProductCode}`,
            name: service.ProductShortName || 'DHL Service',
            type: 'express' as const,
            estimatedDays: typeof service.DeliveryTime === 'number' 
              ? { min: service.DeliveryTime, max: service.DeliveryTime + 2 }
              : { min: deliveryTime, max: deliveryTime + 2 },
            description: service.ProductDesc || '',
          },
          cost: parseFloat(service.TotalNet?.Amount || 0),
          currency: options.currency || 'USD',
          metadata: {
            productCode: service.GlobalProductCode,
            totalCharge: service.TotalCharge,
          },
        })),
        errors: response.RateResponse?.Notification?.filter((n: any) => n.Severity === 'ERROR') || [],
      };
    },
  };

  return new APIProviderAdapter(adapterOptions);
}

/**
 * Pre-configured DHL shipping options
 */
export const dhlShippingOptions: ShippingOption[] = [
  {
    id: 'dhl-express',
    name: 'DHL Express',
    type: 'express',
    description: 'Envío express internacional',
    estimatedDays: { min: 2, max: 3 },
  },
  {
    id: 'dhl-economy',
    name: 'DHL Economy',
    type: 'economy',
    description: 'Envío económico internacional',
    estimatedDays: { min: 7, max: 10 },
  },
  {
    id: 'dhl-standard',
    name: 'DHL Standard',
    type: 'standard',
    description: 'Envío estándar internacional',
    estimatedDays: { min: 5, max: 7 },
  },
];


