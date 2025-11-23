import React from 'react';
import { useCart } from '../hooks/useCart';
import { useCartSync } from '../hooks/useCartSync';
import { CartItem } from './CartItem';
import type { CartItemProps } from './CartItem';
import type { CartManagerOptions, CartItem as CartItemType, CartSyncOptions, CartHistoryOptions } from '@alejandrovrod/blocks-core';

export interface CartViewProps {
  className?: string;
  emptyMessage?: React.ReactNode;
  renderEmpty?: () => React.ReactNode;
  renderItem?: (item: CartItemType) => React.ReactNode;
  renderHeader?: () => React.ReactNode;
  renderFooter?: () => React.ReactNode;
  cartOptions?: CartManagerOptions;
  itemProps?: Omit<CartItemProps, 'item'>;
  enableSync?: boolean;
  syncOptions?: CartSyncOptions;
  enableHistory?: boolean;
  historyOptions?: CartHistoryOptions;
}

/**
 * CartView component - Displays the full cart with all items
 * Fully customizable, no styles included
 * Uses logical CSS classes: vkecom-cart-view, vkecom-cart-list, etc.
 */
export function CartView({
  className = '',
  emptyMessage = 'Your cart is empty',
  renderEmpty,
  renderItem,
  renderHeader,
  renderFooter,
  cartOptions,
  itemProps,
  enableSync = false,
  syncOptions,
  enableHistory: _enableHistory = false,
  historyOptions: _historyOptions,
}: CartViewProps) {
  const cartResult = useCart(cartOptions);
  
  // Defensive: ensure items is always an array
  const items = Array.isArray(cartResult?.items) ? cartResult.items : [];
  const removeItem = cartResult?.removeItem || (() => {});
  const updateQuantity = cartResult?.updateQuantity || (() => {});
  
  // Enable cart synchronization if requested
  useCartSync(enableSync ? syncOptions : undefined);

  const handleIncrease = (itemId: string) => {
    const item = items.find((i) => i?.id === itemId);
    if (item && updateQuantity) {
      updateQuantity(itemId, (item.quantity || 0) + 1);
    }
  };

  const handleDecrease = (itemId: string) => {
    const item = items.find((i) => i?.id === itemId);
    if (item) {
      if ((item.quantity || 0) > 1) {
        updateQuantity(itemId, item.quantity - 1);
      } else {
        removeItem(itemId);
      }
    }
  };

  return (
    <div className={`vkecom-cart-view ${className}`}>
      {renderHeader && (
        <div className="vkecom-cart-header">{renderHeader()}</div>
      )}

      {!items || items.length === 0 ? (
        <div className="vkecom-cart-empty">
          {renderEmpty ? renderEmpty() : (
            typeof emptyMessage === 'string' ? <p>{emptyMessage}</p> : emptyMessage
          )}
        </div>
      ) : (
        <>
          <div className="vkecom-cart-list" role="list">
            {items
              .filter((item) => item && item.id && item.product) // Filter out invalid items
              .map((item) => (
                <div key={item.id} role="listitem">
                  {renderItem ? (
                    renderItem(item)
                  ) : (
                    <CartItem
                      item={item}
                      onIncrease={handleIncrease}
                      onDecrease={handleDecrease}
                      onRemove={removeItem}
                      {...itemProps}
                    />
                  )}
                </div>
              ))}
          </div>

          {renderFooter && (
            <div className="vkecom-cart-footer">{renderFooter()}</div>
          )}
        </>
      )}
    </div>
  );
}


