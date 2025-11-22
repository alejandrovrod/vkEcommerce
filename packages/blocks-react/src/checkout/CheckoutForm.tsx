/**
 * Checkout form component
 */

import React, { useState, FormEvent } from 'react';
import { useCheckout } from './useCheckout';
// Import types - using the same pattern as useCheckout.ts
// These types should be exported from @vk/blocks-core but may need explicit exports
import type { 
  ShippingAddress,
  BillingAddress, 
  PaymentMethodDetails 
} from '@vk/blocks-core';

export interface CheckoutFormProps {
  /**
   * Initial subtotal
   */
  subtotal: number;
  
  /**
   * Cart ID (optional)
   */
  cartId?: string;
  
  /**
   * Custom class name
   */
  className?: string;
  
  /**
   * On checkout complete callback
   */
  onComplete?: (sessionId: string) => void;
  
  /**
   * On error callback
   */
  onError?: (error: Error) => void;
  
  /**
   * Custom render for form fields
   */
  renderFields?: (props: {
    shippingAddress: Partial<ShippingAddress>;
    billingAddress: Partial<BillingAddress>;
    paymentMethod: Partial<PaymentMethodDetails>;
    onShippingChange: (address: Partial<ShippingAddress>) => void;
    onBillingChange: (address: Partial<BillingAddress>) => void;
    onPaymentChange: (method: Partial<PaymentMethodDetails>) => void;
  }) => React.ReactNode;
  
  /**
   * Custom render for submit button
   */
  renderSubmit?: (props: { loading: boolean; disabled: boolean; onSubmit: () => void }) => React.ReactNode;
  
  /**
   * Children (for custom content)
   */
  children?: React.ReactNode;
}

export function CheckoutForm({
  subtotal,
  cartId,
  className,
  onComplete,
  onError,
  renderFields,
  renderSubmit,
  children,
}: CheckoutFormProps) {
  const checkout = useCheckout();
  const [shippingAddress, setShippingAddress] = useState<Partial<ShippingAddress>>({});
  const [billingAddress, setBillingAddress] = useState<Partial<BillingAddress>>({});
  const [paymentMethod, setPaymentMethod] = useState<Partial<PaymentMethodDetails>>({});
  const [useSameAddress, setUseSameAddress] = useState(true);

  // Initialize checkout session
  React.useEffect(() => {
    checkout.initializeSession(subtotal, cartId);
  }, [subtotal, cartId, checkout]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // Set shipping address
      const shippingResult = checkout.setShippingAddress(shippingAddress as ShippingAddress);
      if (!shippingResult.valid) {
        onError?.(new Error(shippingResult.errors.map(e => e.message).join(', ')));
        return;
      }

      // Set billing address
      const billing = useSameAddress ? (shippingAddress as BillingAddress) : billingAddress;
      const billingResult = checkout.setBillingAddress(billing as BillingAddress);
      if (!billingResult.valid) {
        onError?.(new Error(billingResult.errors.map(e => e.message).join(', ')));
        return;
      }

      // Set payment method
      if (paymentMethod.method) {
        checkout.setPaymentMethod(paymentMethod as PaymentMethodDetails);
      }

      // Validate checkout
      const validation = checkout.validate();
      if (!validation.valid) {
        onError?.(new Error(validation.errors.map(e => e.message).join(', ')));
        return;
      }

      // Create payment
      await checkout.createPayment();
      onComplete?.(checkout.session?.id || '');
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const handleShippingChange = (address: Partial<ShippingAddress>) => {
    setShippingAddress(address);
    if (useSameAddress) {
      setBillingAddress(address);
    }
  };

  const handleBillingChange = (address: Partial<BillingAddress>) => {
    setBillingAddress(address);
  };

  const handlePaymentChange = (method: Partial<PaymentMethodDetails>) => {
    setPaymentMethod(method);
  };

  if (children) {
    return <div className={`vkecom-checkout-form ${className || ''}`}>{children}</div>;
  }

  return (
    <form className={`vkecom-checkout-form ${className || ''}`} onSubmit={handleSubmit}>
      {renderFields ? (
        renderFields({
          shippingAddress,
          billingAddress,
          paymentMethod,
          onShippingChange: handleShippingChange,
          onBillingChange: handleBillingChange,
          onPaymentChange: handlePaymentChange,
        })
      ) : (
        <>
          <div className="vkecom-checkout-shipping">
            <h3>Shipping Address</h3>
            <input
              type="text"
              placeholder="Street"
              value={shippingAddress.street || ''}
              onChange={(e) => handleShippingChange({ ...shippingAddress, street: e.target.value })}
              className="vkecom-checkout-field"
            />
            <input
              type="text"
              placeholder="City"
              value={shippingAddress.city || ''}
              onChange={(e) => handleShippingChange({ ...shippingAddress, city: e.target.value })}
              className="vkecom-checkout-field"
            />
            <input
              type="text"
              placeholder="Postal Code"
              value={shippingAddress.postalCode || ''}
              onChange={(e) => handleShippingChange({ ...shippingAddress, postalCode: e.target.value })}
              className="vkecom-checkout-field"
            />
            <input
              type="text"
              placeholder="Country"
              value={shippingAddress.country || ''}
              onChange={(e) => handleShippingChange({ ...shippingAddress, country: e.target.value })}
              className="vkecom-checkout-field"
            />
          </div>

          <label className="vkecom-checkout-same-address">
            <input
              type="checkbox"
              checked={useSameAddress}
              onChange={(e) => {
                setUseSameAddress(e.target.checked);
                if (e.target.checked) {
                  setBillingAddress(shippingAddress);
                }
              }}
            />
            Use same address for billing
          </label>

          {!useSameAddress && (
            <div className="vkecom-checkout-billing">
              <h3>Billing Address</h3>
              <input
                type="text"
                placeholder="Street"
                value={billingAddress.street || ''}
                onChange={(e) => handleBillingChange({ ...billingAddress, street: e.target.value })}
                className="vkecom-checkout-field"
              />
              <input
                type="text"
                placeholder="City"
                value={billingAddress.city || ''}
                onChange={(e) => handleBillingChange({ ...billingAddress, city: e.target.value })}
                className="vkecom-checkout-field"
              />
              <input
                type="text"
                placeholder="Postal Code"
                value={billingAddress.postalCode || ''}
                onChange={(e) => handleBillingChange({ ...billingAddress, postalCode: e.target.value })}
                className="vkecom-checkout-field"
              />
            </div>
          )}

          <div className="vkecom-checkout-payment">
            <h3>Payment Method</h3>
            <select
              value={paymentMethod.method || ''}
              onChange={(e) => handlePaymentChange({ ...paymentMethod, method: e.target.value as PaymentMethodDetails['method'] })}
              className="vkecom-checkout-field"
            >
              <option value="">Select payment method</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="mercado_pago">Mercado Pago</option>
            </select>
          </div>
        </>
      )}

      {renderSubmit ? (
        renderSubmit({
          loading: checkout.loading,
          disabled: !checkout.session || checkout.status !== 'pending',
          onSubmit: () => handleSubmit({ preventDefault: () => {} } as FormEvent),
        })
      ) : (
        <button
          type="submit"
          disabled={checkout.loading || !checkout.session || checkout.status !== 'pending'}
          className="vkecom-checkout-submit"
        >
          {checkout.loading ? 'Processing...' : 'Complete Checkout'}
        </button>
      )}

      {checkout.error && (
        <div className="vkecom-checkout-error">{checkout.error.message}</div>
      )}
    </form>
  );
}

