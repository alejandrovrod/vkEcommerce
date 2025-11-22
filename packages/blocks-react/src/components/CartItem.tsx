import React from 'react';
import type { CartItem as CartItemType } from '@vk/blocks-core';

export interface CartItemProps {
  item: CartItemType;
  className?: string;
  children?: React.ReactNode;
  renderImage?: (item: CartItemType) => React.ReactNode;
  renderTitle?: (item: CartItemType) => React.ReactNode;
  renderPrice?: (item: CartItemType) => React.ReactNode;
  renderQuantity?: (item: CartItemType, onIncrease: () => void, onDecrease: () => void) => React.ReactNode;
  renderRemove?: (item: CartItemType, onRemove: () => void) => React.ReactNode;
  onIncrease?: (itemId: string) => void;
  onDecrease?: (itemId: string) => void;
  onRemove?: (itemId: string) => void;
}

/**
 * CartItem component - Displays a single cart item
 * Fully customizable, no styles included
 * Uses logical CSS classes: vkecom-cart-item, vkecom-cart-item-image, etc.
 */
export function CartItem({
  item,
  className = '',
  children,
  renderImage,
  renderTitle,
  renderPrice,
  renderQuantity,
  renderRemove,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  const handleIncrease = () => {
    if (onIncrease) {
      onIncrease(item.id);
    }
  };

  const handleDecrease = () => {
    if (onDecrease) {
      onDecrease(item.id);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(item.id);
    }
  };

  return (
    <div
      className={`vkecom-cart-item ${className}`}
      data-item-id={item.id}
      itemScope
      itemType="https://schema.org/Product"
    >
      {children ? (
        children
      ) : (
        <>
          <div className="vkecom-cart-item-image">
            {renderImage ? (
              renderImage(item)
            ) : item.product.image ? (
              <img
                src={item.product.image}
                alt={item.product.name}
                loading="lazy"
                itemProp="image"
              />
            ) : (
              <div className="vkecom-cart-item-image-placeholder">No image</div>
            )}
          </div>

          <div className="vkecom-cart-item-details">
            {renderTitle ? (
              renderTitle(item)
            ) : (
              <h3 className="vkecom-cart-item-name" itemProp="name">
                {item.product.name}
              </h3>
            )}

            {item.product.description && (
              <p className="vkecom-cart-item-description" itemProp="description">
                {item.product.description}
              </p>
            )}

            {renderPrice ? (
              renderPrice(item)
            ) : (
              <div
                className="vkecom-cart-item-price"
                itemProp="offers"
                itemScope
                itemType="https://schema.org/Offer"
              >
                <span className="vkecom-cart-item-price-unit">
                  ${item.product.price.toFixed(2)}
                </span>
                <span className="vkecom-cart-item-price-total">
                  Total: ${(item.product.price * item.quantity).toFixed(2)}
                </span>
                <meta itemProp="price" content={item.product.price.toString()} />
                <meta itemProp="priceCurrency" content="USD" />
              </div>
            )}
          </div>

          <div className="vkecom-cart-item-quantity">
            {renderQuantity ? (
              renderQuantity(item, handleIncrease, handleDecrease)
            ) : (
              <>
                <button
                  type="button"
                  className="vkecom-cart-item-quantity-decrease"
                  onClick={handleDecrease}
                  aria-label={`Decrease quantity of ${item.product.name}`}
                >
                  -
                </button>
                <span className="vkecom-cart-item-quantity-value" aria-label={`Quantity: ${item.quantity}`}>
                  {item.quantity}
                </span>
                <button
                  type="button"
                  className="vkecom-cart-item-quantity-increase"
                  onClick={handleIncrease}
                  aria-label={`Increase quantity of ${item.product.name}`}
                >
                  +
                </button>
              </>
            )}
          </div>

          {renderRemove ? (
            renderRemove(item, handleRemove)
          ) : (
            <button
              type="button"
              className="vkecom-cart-item-remove"
              onClick={handleRemove}
              aria-label={`Remove ${item.product.name} from cart`}
            >
              Remove
            </button>
          )}
        </>
      )}
    </div>
  );
}

