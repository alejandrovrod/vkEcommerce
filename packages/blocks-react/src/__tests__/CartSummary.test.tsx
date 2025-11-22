import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartSummary } from '../components/CartSummary';
import { useCart } from '../hooks/useCart';
import { CartStore } from '@vk/blocks-core';
import type { Product } from '@vk/blocks-core';

// Mock useCart hook
vi.mock('../hooks/useCart', () => ({
  useCart: vi.fn(),
}));

const mockUseCart = useCart as ReturnType<typeof vi.fn>;

describe('CartSummary', () => {
  beforeEach(() => {
    CartStore.resetInstance();
    vi.clearAllMocks();
  });

  it('should render item count', () => {
    mockUseCart.mockReturnValue({
      total: 50,
      itemCount: 3,
    });

    render(<CartSummary />);

    expect(screen.getByText('3 items')).toBeInTheDocument();
  });

  it('should render singular "item" when count is 1', () => {
    mockUseCart.mockReturnValue({
      total: 10,
      itemCount: 1,
    });

    render(<CartSummary />);

    expect(screen.getByText('1 item')).toBeInTheDocument();
  });

  it('should render subtotal', () => {
    mockUseCart.mockReturnValue({
      total: 50,
      itemCount: 2,
    });

    const { container } = render(<CartSummary />);

    expect(screen.getByText('Subtotal:')).toBeInTheDocument();
    const subtotalSection = container.querySelector('.vkecom-cart-summary-subtotal');
    expect(subtotalSection).toHaveTextContent('$50.00');
  });

  it('should render tax when enabled', () => {
    mockUseCart.mockReturnValue({
      total: 100,
      itemCount: 1,
    });

    render(<CartSummary showTax taxRate={0.1} />);

    expect(screen.getByText('Tax:')).toBeInTheDocument();
    expect(screen.getByText('$10.00')).toBeInTheDocument(); // 100 * 0.1
  });

  it('should render shipping when enabled', () => {
    mockUseCart.mockReturnValue({
      total: 50,
      itemCount: 1,
    });

    render(<CartSummary showShipping shippingCost={5.99} />);

    expect(screen.getByText('Shipping:')).toBeInTheDocument();
    expect(screen.getByText('$5.99')).toBeInTheDocument();
  });

  it('should render total', () => {
    mockUseCart.mockReturnValue({
      total: 50,
      itemCount: 1,
    });

    const { container } = render(<CartSummary />);

    expect(screen.getByText('Total:')).toBeInTheDocument();
    const totalSection = container.querySelector('.vkecom-cart-summary-total');
    expect(totalSection).toHaveTextContent('$50.00');
  });

  it('should calculate final total correctly with tax and shipping', () => {
    mockUseCart.mockReturnValue({
      total: 100,
      itemCount: 1,
    });

    render(<CartSummary showTax taxRate={0.1} showShipping shippingCost={5.99} />);

    // Subtotal: $100.00
    // Tax: $10.00 (100 * 0.1)
    // Shipping: $5.99
    // Total: $115.99
    const totals = screen.getAllByText(/\$115\.99/);
    expect(totals.length).toBeGreaterThan(0);
  });

  it('should call onCheckout when checkout button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnCheckout = vi.fn();

    mockUseCart.mockReturnValue({
      total: 50,
      itemCount: 1,
    });

    render(
      <CartSummary
        renderCheckout={(onCheckout) => (
          <button onClick={onCheckout}>Checkout</button>
        )}
        onCheckout={mockOnCheckout}
      />
    );

    const checkoutButton = screen.getByText('Checkout');
    await user.click(checkoutButton);

    expect(mockOnCheckout).toHaveBeenCalled();
  });

  it('should render with custom className', () => {
    mockUseCart.mockReturnValue({
      total: 50,
      itemCount: 1,
    });

    const { container } = render(<CartSummary className="custom-summary" />);

    const summary = container.querySelector('.vkecom-cart-summary');
    expect(summary).toHaveClass('custom-summary');
  });

  it('should use custom formatPrice function', () => {
    mockUseCart.mockReturnValue({
      total: 50.5,
      itemCount: 1,
    });

    const formatPrice = (price: number) => `€${price.toFixed(2)}`;

    const { container } = render(<CartSummary formatPrice={formatPrice} />);

    const subtotalSection = container.querySelector('.vkecom-cart-summary-subtotal');
    expect(subtotalSection).toHaveTextContent('€50.50');
  });

  it('should hide item count when showItemCount is false', () => {
    mockUseCart.mockReturnValue({
      total: 50,
      itemCount: 3,
    });

    render(<CartSummary showItemCount={false} />);

    expect(screen.queryByText(/items?/)).not.toBeInTheDocument();
  });

  it('should hide subtotal when showSubtotal is false', () => {
    mockUseCart.mockReturnValue({
      total: 50,
      itemCount: 1,
    });

    render(<CartSummary showSubtotal={false} />);

    expect(screen.queryByText('Subtotal:')).not.toBeInTheDocument();
  });

  it('should hide total when showTotal is false', () => {
    mockUseCart.mockReturnValue({
      total: 50,
      itemCount: 1,
    });

    render(<CartSummary showTotal={false} />);

    expect(screen.queryByText('Total:')).not.toBeInTheDocument();
  });

  it('should render custom render functions', () => {
    mockUseCart.mockReturnValue({
      total: 50,
      itemCount: 2,
    });

    render(
      <CartSummary
        renderSubtotal={(subtotal) => (
          <div data-testid="custom-subtotal">Sub: ${subtotal}</div>
        )}
        renderTotal={(total) => (
          <div data-testid="custom-total">Grand Total: ${total}</div>
        )}
      />
    );

    expect(screen.getByTestId('custom-subtotal')).toHaveTextContent('Sub: $50');
    expect(screen.getByTestId('custom-total')).toHaveTextContent('Grand Total: $50');
  });
});

