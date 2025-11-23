import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CartView } from '../components/CartView';
import { useCart } from '../hooks/useCart';
import { CartStore } from '@alejandrovrod/blocks-core';
import type { Product } from '@alejandrovrod/blocks-core';

// Mock useCart hook
vi.mock('../hooks/useCart', () => ({
  useCart: vi.fn(),
}));

const mockUseCart = useCart as ReturnType<typeof vi.fn>;

describe('CartView', () => {
  beforeEach(() => {
    CartStore.resetInstance();
    vi.clearAllMocks();
  });

  it('should render empty cart message when cart is empty', () => {
    mockUseCart.mockReturnValue({
      items: [],
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
    });

    render(<CartView />);

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('should render custom empty message', () => {
    mockUseCart.mockReturnValue({
      items: [],
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
    });

    render(<CartView emptyMessage="No items in cart" />);

    expect(screen.getByText('No items in cart')).toBeInTheDocument();
  });

  it('should render cart items when cart has items', () => {
    const product1: Product = { id: '1', name: 'Product 1', price: 10 };
    const product2: Product = { id: '2', name: 'Product 2', price: 20 };

    mockUseCart.mockReturnValue({
      items: [
        {
          id: '1',
          product: product1,
          quantity: 2,
          addedAt: Date.now(),
        },
        {
          id: '2',
          product: product2,
          quantity: 1,
          addedAt: Date.now(),
        },
      ],
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
    });

    render(<CartView />);

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  it('should render with custom className', () => {
    mockUseCart.mockReturnValue({
      items: [],
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
    });

    const { container } = render(<CartView className="custom-cart" />);

    const cartView = container.querySelector('.vkecom-cart-view');
    expect(cartView).toHaveClass('custom-cart');
  });

  it('should render custom header when renderHeader is provided', () => {
    mockUseCart.mockReturnValue({
      items: [],
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
    });

    render(
      <CartView renderHeader={() => <h1>My Shopping Cart</h1>} />
    );

    expect(screen.getByText('My Shopping Cart')).toBeInTheDocument();
  });

  it('should render custom footer when renderFooter is provided', () => {
    const product: Product = { id: '1', name: 'Product 1', price: 10 };

    mockUseCart.mockReturnValue({
      items: [
        {
          id: '1',
          product,
          quantity: 1,
          addedAt: Date.now(),
        },
      ],
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
    });

    render(
      <CartView renderFooter={() => <button>Proceed to Checkout</button>} />
    );

    expect(screen.getByText('Proceed to Checkout')).toBeInTheDocument();
  });

  it('should render custom empty state', () => {
    mockUseCart.mockReturnValue({
      items: [],
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
    });

    render(
      <CartView renderEmpty={() => <div data-testid="custom-empty">Custom empty state</div>} />
    );

    expect(screen.getByTestId('custom-empty')).toBeInTheDocument();
  });

  it('should render custom items when renderItem is provided', () => {
    const product: Product = { id: '1', name: 'Product 1', price: 10 };

    mockUseCart.mockReturnValue({
      items: [
        {
          id: '1',
          product,
          quantity: 1,
          addedAt: Date.now(),
        },
      ],
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
    });

    render(
      <CartView
        renderItem={(item) => (
          <div data-testid="custom-item">{item.product.name}</div>
        )}
      />
    );

    expect(screen.getByTestId('custom-item')).toHaveTextContent('Product 1');
  });

  it('should have semantic HTML structure', () => {
    const product: Product = { id: '1', name: 'Product 1', price: 10 };

    mockUseCart.mockReturnValue({
      items: [
        {
          id: '1',
          product,
          quantity: 1,
          addedAt: Date.now(),
        },
      ],
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
    });

    const { container } = render(<CartView />);

    const list = container.querySelector('.vkecom-cart-list[role="list"]');
    expect(list).toBeInTheDocument();

    const listItems = container.querySelectorAll('[role="listitem"]');
    expect(listItems.length).toBe(1);
  });
});


