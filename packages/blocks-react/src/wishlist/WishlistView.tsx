/**
 * Wishlist view component
 */

import React from 'react';
import { useWishlist } from './useWishlist';

export interface WishlistViewProps {
  /**
   * Custom class name
   */
  className?: string;
  
  /**
   * Empty message
   */
  emptyMessage?: string;
  
  /**
   * Custom render for empty state
   */
  renderEmpty?: () => React.ReactNode;
  
  /**
   * Custom render for wishlist item
   */
  renderItem?: (item: import('@vk/blocks-core').WishlistItem, onRemove: (itemId: string) => void) => React.ReactNode;
  
  /**
   * Custom render for header
   */
  renderHeader?: () => React.ReactNode;
  
  /**
   * Children (for custom content)
   */
  children?: React.ReactNode;
}

export function WishlistView({
  className,
  emptyMessage = 'Your wishlist is empty',
  renderEmpty,
  renderItem,
  renderHeader,
  children,
}: WishlistViewProps) {
  const wishlist = useWishlist();

  if (children) {
    return <div className={`vkecom-wishlist-view ${className || ''}`}>{children}</div>;
  }

  if (wishlist.items.length === 0) {
    return (
      <div className={`vkecom-wishlist-view vkecom-wishlist-view-empty ${className || ''}`}>
        {renderEmpty ? renderEmpty() : <p>{emptyMessage}</p>}
      </div>
    );
  }

  return (
    <div className={`vkecom-wishlist-view ${className || ''}`}>
      {renderHeader && renderHeader()}
      <div className="vkecom-wishlist-list" role="list">
        {wishlist.items.map((item) => (
          <div key={item.id} role="listitem" className="vkecom-wishlist-item">
            {renderItem ? (
              renderItem(item, wishlist.removeItem)
            ) : (
              <div className="vkecom-wishlist-item-content">
                {item.product.image && (
                  <img src={item.product.image} alt={item.product.name} className="vkecom-wishlist-item-image" />
                )}
                <div className="vkecom-wishlist-item-details">
                  <h3 className="vkecom-wishlist-item-name">{item.product.name}</h3>
                  {item.product.description && (
                    <p className="vkecom-wishlist-item-description">{item.product.description}</p>
                  )}
                  <div className="vkecom-wishlist-item-price">${item.product.price.toFixed(2)}</div>
                </div>
                <button
                  type="button"
                  onClick={() => wishlist.removeItem(item.id)}
                  className="vkecom-wishlist-item-remove"
                  aria-label={`Remove ${item.product.name} from wishlist`}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

