/**
 * Shipping calculator component
 */

import React, { useState, FormEvent } from 'react';
import { useShipping } from './useShipping';
import type { ShippingAddress, ShippingCalculationRequest } from '@vk/blocks-core';

export interface ShippingCalculatorProps {
  /**
   * Items to calculate shipping for
   */
  items: Array<{
    weight?: number;
    dimensions?: {
      length?: number;
      width?: number;
      height?: number;
    };
    quantity: number;
    value?: number;
  }>;
  
  /**
   * Custom class name
   */
  className?: string;
  
  /**
   * On rates calculated callback
   */
  onRatesCalculated?: (rates: import('@vk/blocks-core').ShippingRate[]) => void;
  
  /**
   * Custom render for address form
   */
  renderAddressForm?: (props: {
    address: Partial<ShippingAddress>;
    onChange: (address: Partial<ShippingAddress>) => void;
    onSubmit: () => void;
  }) => React.ReactNode;
  
  /**
   * Custom render for rates
   */
  renderRates?: (props: {
    rates: import('@vk/blocks-core').ShippingRate[];
    loading: boolean;
    onSelect: (rate: import('@vk/blocks-core').ShippingRate) => void;
  }) => React.ReactNode;
  
  /**
   * Children (for custom content)
   */
  children?: React.ReactNode;
}

export function ShippingCalculator({
  items,
  className,
  onRatesCalculated,
  renderAddressForm,
  renderRates,
  children,
}: ShippingCalculatorProps) {
  const shipping = useShipping();
  const [address, setAddress] = useState<Partial<ShippingAddress>>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!address.street || !address.city || !address.postalCode || !address.country) {
      return;
    }

    try {
      const request: ShippingCalculationRequest = {
        address: address as ShippingAddress,
        items,
      };

      const result = await shipping.calculate(request);
      onRatesCalculated?.(result.rates);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleAddressChange = (newAddress: Partial<ShippingAddress>) => {
    setAddress(newAddress);
  };

  if (children) {
    return <div className={`vkecom-shipping-calculator ${className || ''}`}>{children}</div>;
  }

  return (
    <div className={`vkecom-shipping-calculator ${className || ''}`}>
      <form onSubmit={handleSubmit}>
        {renderAddressForm ? (
          renderAddressForm({
            address,
            onChange: handleAddressChange,
            onSubmit: () => handleSubmit({ preventDefault: () => {} } as FormEvent),
          })
        ) : (
          <div className="vkecom-shipping-address-form">
            <input
              type="text"
              placeholder="Street"
              value={address.street || ''}
              onChange={(e) => handleAddressChange({ ...address, street: e.target.value })}
              className="vkecom-shipping-field"
            />
            <input
              type="text"
              placeholder="City"
              value={address.city || ''}
              onChange={(e) => handleAddressChange({ ...address, city: e.target.value })}
              className="vkecom-shipping-field"
            />
            <input
              type="text"
              placeholder="Postal Code"
              value={address.postalCode || ''}
              onChange={(e) => handleAddressChange({ ...address, postalCode: e.target.value })}
              className="vkecom-shipping-field"
            />
            <input
              type="text"
              placeholder="Country"
              value={address.country || ''}
              onChange={(e) => handleAddressChange({ ...address, country: e.target.value })}
              className="vkecom-shipping-field"
            />
            <button type="submit" disabled={shipping.loading} className="vkecom-shipping-calculate-button">
              {shipping.loading ? 'Calculating...' : 'Calculate Shipping'}
            </button>
          </div>
        )}

        {shipping.error && (
          <div className="vkecom-shipping-error">{shipping.error.message}</div>
        )}
      </form>

      {renderRates ? (
        renderRates({
          rates: shipping.rates,
          loading: shipping.loading,
          onSelect: () => {},
        })
      ) : (
        shipping.rates.length > 0 && (
          <div className="vkecom-shipping-rates">
            <h3>Shipping Options</h3>
            {shipping.rates.map((rate) => (
              <div key={rate.option.id} className="vkecom-shipping-rate">
                <div className="vkecom-shipping-rate-name">{rate.option.name}</div>
                <div className="vkecom-shipping-rate-cost">
                  ${rate.cost.toFixed(2)} {rate.currency}
                </div>
                {rate.estimatedDays && (
                  <div className="vkecom-shipping-rate-days">
                    {rate.estimatedDays.min}-{rate.estimatedDays.max} days
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

