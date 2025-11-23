/**
 * Product list component
 */

import React from 'react';
import type { Product } from '@alejandrovrod/blocks-core';

export interface ProductListProps {
  /**
   * Products to display
   */
  products: Product[];
  
  /**
   * Custom class name
   */
  className?: string;
  
  /**
   * Custom render for product item
   */
  renderProduct?: (product: Product, index: number) => React.ReactNode;
  
  /**
   * Alias for renderProduct (for compatibility)
   */
  renderItem?: (product: Product, index: number) => React.ReactNode;
  
  /**
   * Empty state message
   */
  emptyMessage?: string;
  
  /**
   * Custom render for empty state
   */
  renderEmpty?: () => React.ReactNode;
  
  /**
   * Children (for custom content)
   */
  children?: React.ReactNode;
}

export function ProductList({
  products,
  className,
  renderProduct,
  renderItem,
  emptyMessage = 'No products found',
  renderEmpty,
  children,
}: ProductListProps) {
  const renderFn = renderItem || renderProduct;
  if (children) {
    return <div className={`vkecom-product-list ${className || ''}`}>{children}</div>;
  }

  if (products.length === 0) {
    return (
      <div className={`vkecom-product-list vkecom-product-list-empty ${className || ''}`}>
        {renderEmpty ? renderEmpty() : <p>{emptyMessage}</p>}
      </div>
    );
  }

  return (
    <div className={`vkecom-product-list ${className || ''}`} role="list">
      {products.map((product, index) => (
        <div key={product.id} role="listitem" className="vkecom-product-list-item">
          {renderFn ? renderFn(product, index) : (
            <div className="vkecom-product-item">
              {product.image && (
                <img src={product.image} alt={product.name} className="vkecom-product-item-image" />
              )}
              <div className="vkecom-product-item-details">
                <h3 className="vkecom-product-item-name">{product.name}</h3>
                {product.description && (
                  <p className="vkecom-product-item-description">{product.description}</p>
                )}
                <div className="vkecom-product-item-price">${product.price.toFixed(2)}</div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}


