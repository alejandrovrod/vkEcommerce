import React from 'react';
import { useCart } from '../hooks/useCart';
import type { Product } from '@alejandrovrod/blocks-core';

export interface ProductCardProps {
  product: Product;
  className?: string;
  children?: React.ReactNode;
  renderImage?: (product: Product) => React.ReactNode;
  renderTitle?: (product: Product) => React.ReactNode;
  renderPrice?: (product: Product) => React.ReactNode;
  renderButton?: (product: Product, onAddToCart: () => void) => React.ReactNode;
  onAddToCart?: (product: Product) => void;
  quantity?: number;
}

/**
 * ProductCard component - Fully customizable, no styles included
 * Uses logical CSS classes: vkecom-product-card, vkecom-product-image, etc.
 */
export function ProductCard({
  product,
  className = '',
  children,
  renderImage,
  renderTitle,
  renderPrice,
  renderButton,
  onAddToCart,
  quantity = 1,
}: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product, quantity);
    onAddToCart?.(product);
  };

  // If children is provided, render it completely custom
  if (children) {
    return (
      <div className={`vkecom-product-card ${className}`.trim()}>
        {children}
      </div>
    );
  }

  return (
    <article
      className={`vkecom-product-card ${className}`.trim()}
      itemScope
      itemType="https://schema.org/Product"
    >
      {renderImage ? (
        renderImage(product)
      ) : (
        <div className="vkecom-product-image">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              itemProp="image"
              loading="lazy"
            />
          ) : (
            <div className="vkecom-product-image-placeholder" aria-hidden="true">
              No image
            </div>
          )}
        </div>
      )}

      <div className="vkecom-product-content">
        {renderTitle ? (
          renderTitle(product)
        ) : (
          <h3 className="vkecom-product-title" itemProp="name">
            {product.name}
          </h3>
        )}

        {product.description && (
          <p className="vkecom-product-description" itemProp="description">
            {product.description}
          </p>
        )}

        {renderPrice ? (
          renderPrice(product)
        ) : (
          <div className="vkecom-product-price" itemProp="offers" itemScope itemType="https://schema.org/Offer">
            <span className="vkecom-product-price-value" itemProp="price" content={String(product.price)}>
              ${product.price.toFixed(2)}
            </span>
            <meta itemProp="priceCurrency" content="USD" />
          </div>
        )}

        {renderButton ? (
          renderButton(product, handleAddToCart)
        ) : (
          <button
            type="button"
            className="vkecom-product-button"
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
          >
            Add to Cart
          </button>
        )}
      </div>
    </article>
  );
}


