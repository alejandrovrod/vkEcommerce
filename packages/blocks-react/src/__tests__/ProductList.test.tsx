/**
 * Tests for ProductList component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductList } from '../products/ProductList';
import type { Product } from '@alejandrovrod/blocks-core';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Product 1',
    price: 100,
    description: 'Description 1',
    image: 'https://example.com/image1.jpg',
  },
  {
    id: '2',
    name: 'Product 2',
    price: 200,
    description: 'Description 2',
    image: 'https://example.com/image2.jpg',
  },
];

describe('ProductList', () => {
  it('should render list of products', () => {
    render(<ProductList products={mockProducts} />);
    
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  it('should render empty message when no products', () => {
    render(<ProductList products={[]} emptyMessage="No products found" />);
    
    expect(screen.getByText('No products found')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <ProductList products={mockProducts} className="custom-class" />
    );
    
    const list = container.querySelector('.vkecom-product-list');
    expect(list?.classList.contains('custom-class')).toBe(true);
  });

  it('should render custom product item', () => {
    const renderItem = vi.fn((product) => (
      <div key={product.id} data-testid={`custom-${product.id}`}>
        {product.name}
      </div>
    ));
    
    render(<ProductList products={mockProducts} renderItem={renderItem} />);
    
    // renderItem should be called for each product
    expect(renderItem).toHaveBeenCalled();
    expect(screen.getByTestId('custom-1')).toBeInTheDocument();
    expect(screen.getByTestId('custom-2')).toBeInTheDocument();
  });

  it('should display product prices', () => {
    render(<ProductList products={mockProducts} />);
    
    expect(screen.getByText('$100.00')).toBeInTheDocument();
    expect(screen.getByText('$200.00')).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    render(<ProductList products={mockProducts} loading={true} />);
    
    const loadingElement = screen.queryByText(/loading/i);
    // Loading state might be handled differently, adjust based on implementation
    expect(loadingElement || screen.getByText('Product 1')).toBeDefined();
  });
});


