/**
 * Product search component
 */

import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useProductSearch } from './useProductSearch';
import type { SearchOptions } from '@vk/blocks-core';

export interface ProductSearchProps {
  /**
   * Initial search query
   */
  initialQuery?: string;
  
  /**
   * Initial search value (alias for initialQuery)
   */
  initialValue?: string;
  
  /**
   * Initial search options
   */
  initialOptions?: SearchOptions;
  
  /**
   * On search callback
   */
  onSearch?: (query: string, options: SearchOptions) => void;
  
  /**
   * Custom class name
   */
  className?: string;
  
  /**
   * Placeholder text
   */
  placeholder?: string;
  
  /**
   * Custom render for search input
   */
  renderInput?: (props: {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: FormEvent) => void;
  }) => React.ReactNode;
  
  /**
   * Children (for custom content)
   */
  children?: React.ReactNode;
}

export function ProductSearch({
  initialQuery,
  initialValue,
  initialOptions,
  onSearch,
  className,
  placeholder = 'Search products...',
  renderInput,
  children,
}: ProductSearchProps) {
  const search = useProductSearch(initialOptions);
  const [localQuery, setLocalQuery] = useState(initialQuery || initialValue || search.query);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    search.setQuery(localQuery);
    onSearch?.(localQuery, { ...search.options, query: localQuery });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalQuery(value);
    // Call onSearch on change (debounced would be better in production)
    if (onSearch && value.length > 0) {
      onSearch(value, { ...search.options, query: value });
    }
  };

  if (children) {
    return <div className={`vkecom-product-search ${className || ''}`}>{children}</div>;
  }

  return (
    <form className={`vkecom-product-search ${className || ''}`} onSubmit={handleSubmit}>
      {renderInput ? (
        renderInput({
          value: localQuery,
          onChange: handleChange,
          onSubmit: handleSubmit,
        })
      ) : (
        <input
          type="search"
          value={localQuery}
          onChange={handleChange}
          placeholder={placeholder}
          className="vkecom-product-search-input"
        />
      )}
    </form>
  );
}

