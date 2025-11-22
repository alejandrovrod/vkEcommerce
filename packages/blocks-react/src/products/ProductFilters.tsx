/**
 * Product filters component
 */

import React from 'react';
import type { ProductFilter } from '@vk/blocks-core';

export interface ProductFiltersProps {
  /**
   * Current filters
   */
  filters: ProductFilter;
  
  /**
   * Available facets (for filter options)
   */
  facets?: {
    categories?: Array<{ id: string; name: string; count: number }>;
    priceRanges?: Array<{ min: number; max: number; count: number }>;
    tags?: Array<{ tag: string; count: number }>;
  };
  
  /**
   * On filters change callback
   */
  onChange?: (filters: ProductFilter) => void;
  
  /**
   * Alias for onChange (for compatibility)
   */
  onFiltersChange?: (filters: ProductFilter) => void;
  
  /**
   * Custom class name
   */
  className?: string;
  
  /**
   * Custom render for filter section
   */
  renderFilters?: (props: {
    filters: ProductFilter;
    facets: ProductFiltersProps['facets'];
    onChange: (filters: ProductFilter) => void;
  }) => React.ReactNode;
  
  /**
   * Children (for custom content)
   */
  children?: React.ReactNode;
}

export function ProductFilters({
  filters,
  facets,
  onChange,
  onFiltersChange,
  className,
  renderFilters,
  children,
}: ProductFiltersProps) {
  const handleChange = onFiltersChange || onChange || (() => {});
  const handlePriceRangeChange = (min?: number, max?: number) => {
    handleChange({
      ...filters,
      priceRange: { min, max },
    });
  };

  const handleCategoryToggle = (categoryId: string) => {
    const currentCategories = filters.categories || [];
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter((id) => id !== categoryId)
      : [...currentCategories, categoryId];
    
    handleChange({
      ...filters,
      categories: newCategories.length > 0 ? newCategories : undefined,
    });
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];
    
    handleChange({
      ...filters,
      tags: newTags.length > 0 ? newTags : undefined,
    });
  };

  const handleStockToggle = (inStock: boolean) => {
    handleChange({
      ...filters,
      inStock: filters.inStock === inStock ? undefined : inStock,
    });
  };

  if (children) {
    return <div className={`vkecom-product-filters ${className || ''}`}>{children}</div>;
  }

  if (renderFilters) {
    return (
      <div className={`vkecom-product-filters ${className || ''}`}>
        {renderFilters({ filters, facets, onChange: handleChange })}
      </div>
    );
  }

  return (
    <div className={`vkecom-product-filters ${className || ''}`}>
      <div className="vkecom-product-filters-section">
        <h3>Price Range</h3>
        <input
          type="number"
          placeholder="Min"
          value={filters.priceRange?.min || ''}
          onChange={(e) => handlePriceRangeChange(
            e.target.value ? parseFloat(e.target.value) : undefined,
            filters.priceRange?.max
          )}
          className="vkecom-product-filters-input"
        />
        <input
          type="number"
          placeholder="Max"
          value={filters.priceRange?.max || ''}
          onChange={(e) => handlePriceRangeChange(
            filters.priceRange?.min,
            e.target.value ? parseFloat(e.target.value) : undefined
          )}
          className="vkecom-product-filters-input"
        />
      </div>

      {facets?.categories && facets.categories.length > 0 && (
        <div className="vkecom-product-filters-section">
          <h3>Categories</h3>
          {facets.categories.map((category) => (
            <label key={category.id} className="vkecom-product-filters-checkbox">
              <input
                type="checkbox"
                checked={filters.categories?.includes(category.id) || false}
                onChange={() => handleCategoryToggle(category.id)}
              />
              <span>{category.name} ({category.count})</span>
            </label>
          ))}
        </div>
      )}

      {facets?.tags && facets.tags.length > 0 && (
        <div className="vkecom-product-filters-section">
          <h3>Tags</h3>
          {facets.tags.map((tagItem) => (
            <label key={tagItem.tag} className="vkecom-product-filters-checkbox">
              <input
                type="checkbox"
                checked={filters.tags?.includes(tagItem.tag) || false}
                onChange={() => handleTagToggle(tagItem.tag)}
              />
              <span>{tagItem.tag} ({tagItem.count})</span>
            </label>
          ))}
        </div>
      )}

      <div className="vkecom-product-filters-section">
        <label className="vkecom-product-filters-checkbox">
          <input
            type="checkbox"
            checked={filters.inStock === true}
            onChange={() => handleStockToggle(true)}
          />
          <span>In Stock Only</span>
        </label>
      </div>
    </div>
  );
}

