/**
 * Mercado Pago payment button component
 */

import React, { useEffect, useRef } from 'react';
import { useCheckout } from './useCheckout';

export interface MercadoPagoButtonProps {
  /**
   * Mercado Pago public key
   */
  publicKey: string;
  
  /**
   * Payment preference ID (from createPayment)
   */
  preferenceId?: string;
  
  /**
   * Custom class name
   */
  className?: string;
  
  /**
   * Button text
   */
  label?: string;
  
  /**
   * On payment success callback
   */
  onSuccess?: (paymentId: string) => void;
  
  /**
   * On payment error callback
   */
  onError?: (error: Error) => void;
  
  /**
   * Custom render for button
   */
  renderButton?: (props: { onClick: () => void; loading: boolean; disabled: boolean }) => React.ReactNode;
  
  /**
   * Children (for custom content)
   */
  children?: React.ReactNode;
}

export function MercadoPagoButton({
  publicKey,
  preferenceId,
  className,
  label = 'Pay with Mercado Pago',
  onSuccess: _onSuccess,
  onError,
  renderButton,
  children,
}: MercadoPagoButtonProps) {
  const checkout = useCheckout();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mercadoPagoLoaded = useRef(false);

  // Load Mercado Pago SDK
  useEffect(() => {
    if (mercadoPagoLoaded.current || typeof window === 'undefined') {
      return;
    }

    // Check if SDK is already loaded
    if ((window as any).MercadoPago) {
      mercadoPagoLoaded.current = true;
      return;
    }

    // Load SDK script
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    script.onload = () => {
      mercadoPagoLoaded.current = true;
    };
    script.onerror = () => {
      onError?.(new Error('Failed to load Mercado Pago SDK'));
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [onError]);

  const handleClick = async () => {
    try {
      if (!preferenceId) {
        // Create payment preference first
        const payment = await checkout.createPayment();
        if (payment.initPoint) {
          window.location.href = payment.initPoint;
        } else {
          onError?.(new Error('No payment URL available'));
        }
      } else {
        // Use existing preference ID
        if ((window as any).MercadoPago) {
          const mp = new (window as any).MercadoPago(publicKey);
          mp.checkout({
            preference: {
              id: preferenceId,
            },
            render: {
              container: buttonRef.current?.parentElement || '.vkecom-mercadopago-button',
              label: label,
            },
          });
        } else {
          // Fallback: redirect to init point
          const payment = await checkout.verifyPayment(preferenceId);
          if (payment.data?.initPoint) {
            window.location.href = payment.data.initPoint as string;
          }
        }
      }
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  };

  if (children) {
    return (
      <div className={`vkecom-mercadopago-button ${className || ''}`} onClick={handleClick}>
        {children}
      </div>
    );
  }

  if (renderButton) {
    return (
      <div className={`vkecom-mercadopago-button ${className || ''}`}>
        {renderButton({
          onClick: handleClick,
          loading: checkout.loading,
          disabled: !preferenceId && !checkout.session,
        })}
      </div>
    );
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      disabled={checkout.loading || (!preferenceId && !checkout.session)}
      className={`vkecom-mercadopago-button ${className || ''}`}
    >
      {checkout.loading ? 'Loading...' : label}
    </button>
  );
}

