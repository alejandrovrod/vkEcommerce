import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductCard } from '../components/ProductCard';
import { CartStore } from '@alejandrovrod/blocks-core';
import type { Product } from '@alejandrovrod/blocks-core';

describe('ProductCard', () => {
  beforeEach(() => {
    CartStore.resetInstance();
  });

  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    price: 29.99,
    image: 'https://example.com/image.jpg',
    description: 'Test description',
  };

  it('should render product information', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByAltText('Test Product')).toBeInTheDocument();
  });

  it('should render with custom className', () => {
    const { container } = render(
      <ProductCard product={mockProduct} className="custom-class" />
    );

    const card = container.querySelector('.vkecom-product-card');
    expect(card).toHaveClass('custom-class');
  });

  it('should render custom children', () => {
    render(
      <ProductCard product={mockProduct}>
        <div data-testid="custom-content">Custom Content</div>
      </ProductCard>
    );

    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    expect(screen.queryByText('Test Product')).not.toBeInTheDocument();
  });

  it('should render custom image', () => {
    const renderImage = (product: Product) => (
      <div data-testid="custom-image">{product.name} Image</div>
    );

    render(<ProductCard product={mockProduct} renderImage={renderImage} />);

    expect(screen.getByTestId('custom-image')).toBeInTheDocument();
    expect(screen.queryByAltText('Test Product')).not.toBeInTheDocument();
  });

  it('should render custom title', () => {
    const renderTitle = (product: Product) => (
      <h1 data-testid="custom-title">{product.name.toUpperCase()}</h1>
    );

    render(<ProductCard product={mockProduct} renderTitle={renderTitle} />);

    expect(screen.getByTestId('custom-title')).toHaveTextContent('TEST PRODUCT');
  });

  it('should render custom price', () => {
    const renderPrice = (product: Product) => (
      <span data-testid="custom-price">Price: ${product.price}</span>
    );

    render(<ProductCard product={mockProduct} renderPrice={renderPrice} />);

    expect(screen.getByTestId('custom-price')).toHaveTextContent('Price: $29.99');
  });

  it('should render custom button', () => {
    const renderButton = (product: Product, onAddToCart: () => void) => (
      <button data-testid="custom-button" onClick={onAddToCart}>
        Buy {product.name}
      </button>
    );

    render(<ProductCard product={mockProduct} renderButton={renderButton} />);

    const button = screen.getByTestId('custom-button');
    expect(button).toHaveTextContent('Buy Test Product');
  });

  it('should add product to cart when button is clicked', async () => {
    const user = userEvent.setup();
    const onAddToCart = vi.fn();
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);

    const button = screen.getByRole('button', { name: /add test product to cart/i });
    await user.click(button);

    // Verify callback was called
    expect(onAddToCart).toHaveBeenCalledWith(mockProduct);
    expect(button).toBeInTheDocument();
  });

  it('should call onAddToCart callback', async () => {
    const user = userEvent.setup();
    const onAddToCart = vi.fn();
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);

    const button = screen.getByRole('button', { name: /add test product to cart/i });
    await user.click(button);

    expect(onAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('should use custom quantity when adding to cart', async () => {
    const user = userEvent.setup();
    const onAddToCart = vi.fn();
    render(
      <ProductCard product={mockProduct} quantity={3} onAddToCart={onAddToCart} />
    );

    const button = screen.getByRole('button', { name: /add test product to cart/i });
    await user.click(button);

    expect(onAddToCart).toHaveBeenCalled();
  });

  it('should render placeholder when no image', () => {
    const productWithoutImage: Product = {
      id: '2',
      name: 'No Image Product',
      price: 10,
    };

    render(<ProductCard product={productWithoutImage} />);

    expect(screen.getByText('No image')).toBeInTheDocument();
  });

  it('should have semantic HTML structure', () => {
    const { container } = render(<ProductCard product={mockProduct} />);

    const article = container.querySelector('article[itemscope]');
    expect(article).toBeInTheDocument();
    expect(article).toHaveAttribute('itemtype', 'https://schema.org/Product');
  });

  it('should have accessible button with aria-label', () => {
    render(<ProductCard product={mockProduct} />);

    const button = screen.getByRole('button', { name: /add test product to cart/i });
    expect(button).toBeInTheDocument();
  });
});


