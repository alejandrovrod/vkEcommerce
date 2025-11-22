/**
 * Payment method selector component
 */

import React from 'react';
import type { PaymentMethodDetails, PaymentMethod } from '@vk/blocks-core';

export interface PaymentMethodSelectorProps {
  /**
   * Selected payment method
   */
  value?: PaymentMethodDetails;
  
  /**
   * Available payment methods
   */
  methods?: PaymentMethod[];
  
  /**
   * On change callback
   */
  onChange: (method: PaymentMethodDetails) => void;
  
  /**
   * Custom class name
   */
  className?: string;
  
  /**
   * Custom render for method option
   */
  renderMethod?: (method: PaymentMethod, selected: boolean, onSelect: () => void) => React.ReactNode;
  
  /**
   * Children (for custom content)
   */
  children?: React.ReactNode;
}

const DEFAULT_METHODS: PaymentMethod[] = [
  'credit_card',
  'debit_card',
  'bank_transfer',
  'cash',
  'digital_wallet',
  'mercado_pago',
];

const METHOD_LABELS: Record<PaymentMethod, string> = {
  credit_card: 'Credit Card',
  debit_card: 'Debit Card',
  bank_transfer: 'Bank Transfer',
  cash: 'Cash',
  digital_wallet: 'Digital Wallet',
  mercado_pago: 'Mercado Pago',
};

export function PaymentMethodSelector({
  value,
  methods = DEFAULT_METHODS,
  onChange,
  className,
  renderMethod,
  children,
}: PaymentMethodSelectorProps) {
  const handleSelect = (method: PaymentMethod) => {
    onChange({
      method,
    });
  };

  if (children) {
    return <div className={`vkecom-payment-method-selector ${className || ''}`}>{children}</div>;
  }

  return (
    <div className={`vkecom-payment-method-selector ${className || ''}`}>
      {methods.map((method) => {
        const selected = value?.method === method;
        const label = METHOD_LABELS[method] || method;

        if (renderMethod) {
          return (
            <React.Fragment key={method}>
              {renderMethod(method, selected, () => handleSelect(method))}
            </React.Fragment>
          );
        }

        return (
          <label key={method} className={`vkecom-payment-method-option ${selected ? 'selected' : ''}`}>
            <input
              type="radio"
              name="payment-method"
              value={method}
              checked={selected}
              onChange={() => handleSelect(method)}
            />
            <span>{label}</span>
          </label>
        );
      })}
    </div>
  );
}

