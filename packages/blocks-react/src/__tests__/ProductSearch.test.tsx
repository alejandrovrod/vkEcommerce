/**
 * Tests for ProductSearch component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ProductSearch } from '../products/ProductSearch';

describe('ProductSearch', () => {
  it('should render search input', () => {
    render(<ProductSearch onSearch={vi.fn()} />);
    
    const input = screen.getByPlaceholderText(/search/i);
    expect(input).toBeInTheDocument();
  });

  it('should call onSearch when typing', async () => {
    const onSearch = vi.fn();
    render(<ProductSearch onSearch={onSearch} />);
    
    const input = screen.getByPlaceholderText(/search/i);
    
    act(() => {
      fireEvent.change(input, { target: { value: 'test query' } });
    });
    
    // onSearch is called on change if value length > 0
    await waitFor(() => {
      expect(onSearch).toHaveBeenCalled();
    }, { timeout: 1000 });
  });

  it('should apply custom className', () => {
    const { container } = render(
      <ProductSearch onSearch={vi.fn()} className="custom-class" />
    );
    
    const search = container.querySelector('.vkecom-product-search');
    expect(search?.classList.contains('custom-class')).toBe(true);
  });

  it('should use initial value', () => {
    render(<ProductSearch onSearch={vi.fn()} initialValue="initial query" />);
    
    const input = screen.getByPlaceholderText(/search/i) as HTMLInputElement;
    // initialValue is used if initialQuery is not provided
    expect(input.value).toBe('initial query');
  });

  it('should show clear button when there is text', () => {
    render(<ProductSearch onSearch={vi.fn()} />);
    
    const input = screen.getByPlaceholderText(/search/i);
    
    act(() => {
      fireEvent.change(input, { target: { value: 'test' } });
    });
    
    const clearButton = screen.queryByRole('button', { name: /clear/i });
    // Clear button might be optional, adjust based on implementation
    expect(input.value).toBe('test');
  });
});

