import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartItem } from '../components/CartItem';
import type { CartItem as CartItemType } from '@vk/blocks-core';

const mockCartItem: CartItemType = {
  id: '1',
  product: {
    id: 'prod-1',
    name: 'Test Product',
    price: 29.99,
    image: 'https://example.com/image.jpg',
    description: 'Test description',
  },
  quantity: 2,
  addedAt: Date.now(),
};

describe('CartItem', () => {
  const mockOnIncrease = vi.fn();
  const mockOnDecrease = vi.fn();
  const mockOnRemove = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render cart item information', () => {
    render(
      <CartItem
        item={mockCartItem}
        onIncrease={mockOnIncrease}
        onDecrease={mockOnDecrease}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('Total: $59.98')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByAltText('Test Product')).toBeInTheDocument();
  });

  it('should render with custom className', () => {
    const { container } = render(
      <CartItem
        item={mockCartItem}
        className="custom-class"
        onIncrease={mockOnIncrease}
        onDecrease={mockOnDecrease}
        onRemove={mockOnRemove}
      />
    );

    const item = container.querySelector('.vkecom-cart-item');
    expect(item).toHaveClass('custom-class');
  });

  it('should render custom children', () => {
    render(
      <CartItem
        item={mockCartItem}
        onIncrease={mockOnIncrease}
        onDecrease={mockOnDecrease}
        onRemove={mockOnRemove}
      >
        <div data-testid="custom-content">Custom UI</div>
      </CartItem>
    );

    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    expect(screen.queryByText('Test Product')).not.toBeInTheDocument();
  });

  it('should call onIncrease when increase button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CartItem
        item={mockCartItem}
        onIncrease={mockOnIncrease}
        onDecrease={mockOnDecrease}
        onRemove={mockOnRemove}
      />
    );

    const increaseButton = screen.getByRole('button', { name: /increase quantity of test product/i });
    await user.click(increaseButton);

    expect(mockOnIncrease).toHaveBeenCalledWith('1');
  });

  it('should call onDecrease when decrease button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CartItem
        item={mockCartItem}
        onIncrease={mockOnIncrease}
        onDecrease={mockOnDecrease}
        onRemove={mockOnRemove}
      />
    );

    const decreaseButton = screen.getByRole('button', { name: /decrease quantity of test product/i });
    await user.click(decreaseButton);

    expect(mockOnDecrease).toHaveBeenCalledWith('1');
  });

  it('should call onRemove when remove button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CartItem
        item={mockCartItem}
        onIncrease={mockOnIncrease}
        onDecrease={mockOnDecrease}
        onRemove={mockOnRemove}
      />
    );

    const removeButton = screen.getByRole('button', { name: /remove test product from cart/i });
    await user.click(removeButton);

    expect(mockOnRemove).toHaveBeenCalledWith('1');
  });

  it('should render custom image', () => {
    const renderImage = (item: CartItemType) => (
      <img data-testid="custom-image" src={item.product.image} alt="Custom Alt" />
    );

    render(
      <CartItem
        item={mockCartItem}
        renderImage={renderImage}
        onIncrease={mockOnIncrease}
        onDecrease={mockOnDecrease}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByTestId('custom-image')).toBeInTheDocument();
    expect(screen.queryByAltText('Test Product')).not.toBeInTheDocument();
  });

  it('should render placeholder when no image', () => {
    const itemWithoutImage: CartItemType = {
      ...mockCartItem,
      product: { ...mockCartItem.product, image: undefined },
    };

    render(
      <CartItem
        item={itemWithoutImage}
        onIncrease={mockOnIncrease}
        onDecrease={mockOnDecrease}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByText('No image')).toBeInTheDocument();
  });

  it('should have semantic HTML structure', () => {
    const { container } = render(
      <CartItem
        item={mockCartItem}
        onIncrease={mockOnIncrease}
        onDecrease={mockOnDecrease}
        onRemove={mockOnRemove}
      />
    );

    const item = container.querySelector('div[itemscope]');
    expect(item).toBeInTheDocument();
    expect(item).toHaveAttribute('itemtype', 'https://schema.org/Product');

    const image = container.querySelector('img[itemprop="image"]');
    expect(image).toBeInTheDocument();

    const name = container.querySelector('h3[itemprop="name"]');
    expect(name).toBeInTheDocument();
  });

  it('should render custom quantity controls', () => {
    const renderQuantity = (
      item: CartItemType,
      onIncrease: () => void,
      onDecrease: () => void
    ) => (
      <div data-testid="custom-quantity">
        <button onClick={onDecrease}>-</button>
        <span>{item.quantity}</span>
        <button onClick={onIncrease}>+</button>
      </div>
    );

    render(
      <CartItem
        item={mockCartItem}
        renderQuantity={renderQuantity}
        onIncrease={mockOnIncrease}
        onDecrease={mockOnDecrease}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByTestId('custom-quantity')).toBeInTheDocument();
  });

  it('should render custom remove button', () => {
    const renderRemove = (item: CartItemType, onRemove: () => void) => (
      <button data-testid="custom-remove" onClick={onRemove}>
        Delete {item.product.name}
      </button>
    );

    render(
      <CartItem
        item={mockCartItem}
        renderRemove={renderRemove}
        onIncrease={mockOnIncrease}
        onDecrease={mockOnDecrease}
        onRemove={mockOnRemove}
      />
    );

    const removeButton = screen.getByTestId('custom-remove');
    expect(removeButton).toHaveTextContent('Delete Test Product');
  });
});

