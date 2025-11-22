/**
 * Shipping options selector component
 */

import React from 'react';
import type { ShippingRate } from '@vk/blocks-core';

export interface ShippingOptionsProps {
  /**
   * Available shipping rates
   */
  rates: ShippingRate[];
  
  /**
   * Selected rate ID
   */
  selectedRateId?: string;
  
  /**
   * On rate select callback
   */
  onSelect: (rate: ShippingRate) => void;
  
  /**
   * Custom class name
   */
  className?: string;
  
  /**
   * Custom render for rate option
   */
  renderRate?: (rate: ShippingRate, selected: boolean, onSelect: () => void) => React.ReactNode;
  
  /**
   * Children (for custom content)
   */
  children?: React.ReactNode;
}

export function ShippingOptions({
  rates,
  selectedRateId,
  onSelect,
  className,
  renderRate,
  children,
}: ShippingOptionsProps) {
  if (children) {
    return <div className={`vkecom-shipping-options ${className || ''}`}>{children}</div>;
  }

  if (rates.length === 0) {
    return (
      <div className={`vkecom-shipping-options vkecom-shipping-options-empty ${className || ''}`}>
        <p>No shipping options available</p>
      </div>
    );
  }

  return (
    <div className={`vkecom-shipping-options ${className || ''}`} role="radiogroup">
      {rates.map((rate) => {
        const selected = selectedRateId === rate.option.id;

        if (renderRate) {
          return (
            <React.Fragment key={rate.option.id}>
              {renderRate(rate, selected, () => onSelect(rate))}
            </React.Fragment>
          );
        }

        return (
          <label
            key={rate.option.id}
            className={`vkecom-shipping-option ${selected ? 'selected' : ''}`}
          >
            <input
              type="radio"
              name="shipping-option"
              value={rate.option.id}
              checked={selected}
              onChange={() => onSelect(rate)}
            />
            <div className="vkecom-shipping-option-content">
              <div className="vkecom-shipping-option-name">{rate.option.name}</div>
              <div className="vkecom-shipping-option-cost">
                ${rate.cost.toFixed(2)} {rate.currency}
              </div>
              {rate.estimatedDays && (
                <div className="vkecom-shipping-option-days">
                  {rate.estimatedDays.min}-{rate.estimatedDays.max} days
                </div>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
}

