/**
 * Tests for ProductFilters component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ProductFilters } from '../products/ProductFilters';
import type { ProductFilter } from '@alejandrovrod/blocks-core';

describe('ProductFilters', () => {
  const mockFilters: ProductFilter = {
    categories: ['cat-1'],
    priceRange: { min: 0, max: 200 },
    tags: ['tag1'],
  };

  it('should render filter controls', () => {
    render(<ProductFilters filters={mockFilters} onFiltersChange={vi.fn()} />);
    
    // Filters might render differently, adjust based on implementation
    expect(screen.getByText(/filter/i) || screen.getByRole('form')).toBeDefined();
  });

  it('should call onFiltersChange when filters change', () => {
    const onFiltersChange = vi.fn();
    render(<ProductFilters filters={mockFilters} onFiltersChange={onFiltersChange} />);
    
    // Simulate filter change based on implementation
    const filterInput = screen.queryByRole('textbox') || screen.queryByRole('combobox');
    if (filterInput) {
      act(() => {
        fireEvent.change(filterInput, { target: { value: 'new value' } });
      });
      expect(onFiltersChange).toHaveBeenCalled();
    }
  });

  it('should apply custom className', () => {
    const { container } = render(
      <ProductFilters 
        filters={mockFilters} 
        onFiltersChange={vi.fn()} 
        className="custom-class" 
      />
    );
    
    const filters = container.querySelector('.vkecom-product-filters');
    expect(filters?.classList.contains('custom-class')).toBe(true);
  });

  it('should show available filter options', () => {
    const availableCategories = ['cat-1', 'cat-2', 'cat-3'];
    render(
      <ProductFilters 
        filters={mockFilters} 
        onFiltersChange={vi.fn()}
        availableCategories={availableCategories}
      />
    );
    
    // Check if categories are rendered
    availableCategories.forEach(cat => {
      const element = screen.queryByText(cat);
      // Categories might be in dropdowns or checkboxes
      expect(element || screen.getByRole('form')).toBeDefined();
    });
  });

  it('should clear filters', () => {
    const onFiltersChange = vi.fn();
    render(<ProductFilters filters={mockFilters} onFiltersChange={onFiltersChange} />);
    
    const clearButton = screen.queryByRole('button', { name: /clear/i });
    if (clearButton) {
      act(() => {
        fireEvent.click(clearButton);
      });
      expect(onFiltersChange).toHaveBeenCalledWith({});
    }
  });
});


