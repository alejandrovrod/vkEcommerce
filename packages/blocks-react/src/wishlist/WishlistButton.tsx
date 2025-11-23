/**
 * Wishlist button component
 */

import React from 'react';
import { useWishlist } from './useWishlist';
import type { Product } from '@alejandrovrod/blocks-core';

export interface WishlistButtonProps {
  /**
   * Product to add/remove from wishlist
   */
  product: Product;
  
  /**
   * Custom class name
   */
  className?: string;
  
  /**
   * Button text when product is in wishlist
   */
  inWishlistLabel?: string;
  
  /**
   * Button text when product is not in wishlist
   */
  notInWishlistLabel?: string;
  
  /**
   * On add callback
   */
  onAdd?: (product: Product) => void;
  
  /**
   * On remove callback
   */
  onRemove?: (productId: string) => void;
  
  /**
   * Custom render for button
   */
  renderButton?: (props: {
    inWishlist: boolean;
    onClick: () => void;
  }) => React.ReactNode;
  
  /**
   * Children (for custom content)
   */
  children?: React.ReactNode;
}

export function WishlistButton({
  product,
  className,
  inWishlistLabel = 'Remove from Wishlist',
  notInWishlistLabel = 'Add to Wishlist',
  onAdd,
  onRemove,
  renderButton,
  children,
}: WishlistButtonProps) {
  const wishlist = useWishlist();
  const inWishlist = wishlist.hasProduct(product.id);

  const handleClick = () => {
    if (inWishlist) {
      wishlist.removeProduct(product.id);
      onRemove?.(product.id);
    } else {
      wishlist.addItem(product);
      onAdd?.(product);
    }
  };

  if (children) {
    return (
      <div className={`vkecom-wishlist-button ${className || ''}`} onClick={handleClick}>
        {children}
      </div>
    );
  }

  if (renderButton) {
    return (
      <div className={`vkecom-wishlist-button ${className || ''}`}>
        {renderButton({
          inWishlist,
          onClick: handleClick,
        })}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`vkecom-wishlist-button ${inWishlist ? 'in-wishlist' : ''} ${className || ''}`}
      aria-label={inWishlist ? inWishlistLabel : notInWishlistLabel}
    >
      {inWishlist ? inWishlistLabel : notInWishlistLabel}
    </button>
  );
}


