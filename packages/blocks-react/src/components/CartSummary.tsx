import React from 'react';
import { useCart } from '../hooks/useCart';
import type { CartManagerOptions } from '@vk/blocks-core';

export interface CartSummaryProps {
  className?: string;
  cartOptions?: CartManagerOptions;
  showItemCount?: boolean;
  showSubtotal?: boolean;
  showTax?: boolean;
  taxRate?: number;
  showShipping?: boolean;
  shippingCost?: number;
  showTotal?: boolean;
  renderSubtotal?: (subtotal: number) => React.ReactNode;
  renderTax?: (tax: number) => React.ReactNode;
  renderShipping?: (shipping: number) => React.ReactNode;
  renderTotal?: (total: number) => React.ReactNode;
  renderItemCount?: (count: number) => React.ReactNode;
  renderCheckout?: (onCheckout: () => void) => React.ReactNode;
  onCheckout?: () => void;
  formatPrice?: (price: number) => string;
}

/**
 * CartSummary component - Displays cart summary with totals
 * Fully customizable, no styles included
 * Uses logical CSS classes: vkecom-cart-summary, vkecom-cart-summary-total, etc.
 */
export function CartSummary({
  className = '',
  cartOptions,
  showItemCount = true,
  showSubtotal = true,
  showTax = false,
  taxRate = 0,
  showShipping = false,
  shippingCost = 0,
  showTotal = true,
  renderSubtotal,
  renderTax,
  renderShipping,
  renderTotal,
  renderItemCount,
  renderCheckout,
  onCheckout,
  formatPrice = (price) => `$${price.toFixed(2)}`,
}: CartSummaryProps) {
  const { total, itemCount } = useCart(cartOptions);

  const subtotal = total;
  const tax = subtotal * taxRate;
  const shipping = showShipping ? shippingCost : 0;
  const finalTotal = subtotal + tax + shipping;

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    }
  };

  return (
    <div className={`vkecom-cart-summary ${className}`}>
      {showItemCount && (
        <div className="vkecom-cart-summary-item-count">
          {renderItemCount ? (
            renderItemCount(itemCount)
          ) : (
            <span>
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>
      )}

      {showSubtotal && (
        <div className="vkecom-cart-summary-subtotal">
          {renderSubtotal ? (
            renderSubtotal(subtotal)
          ) : (
            <>
              <span className="vkecom-cart-summary-label">Subtotal:</span>
              <span className="vkecom-cart-summary-value">{formatPrice(subtotal)}</span>
            </>
          )}
        </div>
      )}

      {showTax && taxRate > 0 && (
        <div className="vkecom-cart-summary-tax">
          {renderTax ? (
            renderTax(tax)
          ) : (
            <>
              <span className="vkecom-cart-summary-label">Tax:</span>
              <span className="vkecom-cart-summary-value">{formatPrice(tax)}</span>
            </>
          )}
        </div>
      )}

      {showShipping && (
        <div className="vkecom-cart-summary-shipping">
          {renderShipping ? (
            renderShipping(shipping)
          ) : (
            <>
              <span className="vkecom-cart-summary-label">Shipping:</span>
              <span className="vkecom-cart-summary-value">{formatPrice(shipping)}</span>
            </>
          )}
        </div>
      )}

      {showTotal && (
        <div className="vkecom-cart-summary-total">
          {renderTotal ? (
            renderTotal(finalTotal)
          ) : (
            <>
              <span className="vkecom-cart-summary-label">Total:</span>
              <span className="vkecom-cart-summary-value">{formatPrice(finalTotal)}</span>
            </>
          )}
        </div>
      )}

      {renderCheckout && (
        <div className="vkecom-cart-summary-checkout">
          {renderCheckout(handleCheckout)}
        </div>
      )}
    </div>
  );
}

