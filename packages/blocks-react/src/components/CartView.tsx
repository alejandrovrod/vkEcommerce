import React from 'react';
import { useCart } from '../hooks/useCart';
import { useCartSync } from '../hooks/useCartSync';
import { CartItem } from './CartItem';
import type { CartItemProps } from './CartItem';
import type { CartManagerOptions, CartItem as CartItemType, CartSyncOptions, CartHistoryOptions } from '@vk/blocks-core';

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
  enableHistory = false,
  historyOptions,
}: CartViewProps) {
  const { items, removeItem, updateQuantity } = useCart(cartOptions);
  
  // Enable cart synchronization if requested
  useCartSync(enableSync ? syncOptions : undefined);

  const handleIncrease = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (item) {
      updateQuantity(itemId, item.quantity + 1);
    }
  };

  const handleDecrease = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (item) {
      if (item.quantity > 1) {
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

      {items.length === 0 ? (
        <div className="vkecom-cart-empty">
          {renderEmpty ? renderEmpty() : <p>{emptyMessage}</p>}
        </div>
      ) : (
        <>
          <div className="vkecom-cart-list" role="list">
            {items.map((item) => (
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

