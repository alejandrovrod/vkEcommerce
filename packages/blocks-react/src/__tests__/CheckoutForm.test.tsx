/**
 * Tests for CheckoutForm component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { CheckoutForm } from '../checkout/CheckoutForm';
import type { CheckoutFormProps } from '../checkout/CheckoutForm';

describe('CheckoutForm', () => {
  const defaultProps: CheckoutFormProps = {
    subtotal: 100,
    onComplete: vi.fn(),
    onError: vi.fn(),
  };

  it('should render form fields', () => {
    render(<CheckoutForm {...defaultProps} />);
    
    expect(screen.getByPlaceholderText(/street/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/city/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/postal code/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/country/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/recipient name/i)).toBeInTheDocument();
  });

  it('should call onComplete when form is submitted', async () => {
    const onComplete = vi.fn();
    render(<CheckoutForm {...defaultProps} onComplete={onComplete} />);
    
    // Fill form
    act(() => {
      fireEvent.change(screen.getByPlaceholderText(/street/i), {
        target: { value: 'Av. Corrientes 123' },
      });
      fireEvent.change(screen.getByPlaceholderText(/city/i), {
        target: { value: 'Buenos Aires' },
      });
      fireEvent.change(screen.getByPlaceholderText(/postal code/i), {
        target: { value: 'C1043' },
      });
      fireEvent.change(screen.getByPlaceholderText(/country/i), {
        target: { value: 'AR' },
      });
      fireEvent.change(screen.getByPlaceholderText(/recipient name/i), {
        target: { value: 'Juan Pérez' },
      });
    });
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /complete checkout/i });
    act(() => {
      fireEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    }, { timeout: 2000 });
  });

  it('should show error message on validation failure', async () => {
    const onError = vi.fn();
    render(<CheckoutForm {...defaultProps} onError={onError} />);
    
    // Submit without filling form
    const submitButton = screen.getByRole('button', { name: /complete checkout/i });
    act(() => {
      fireEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });
  });

  it('should apply custom className', () => {
    const { container } = render(
      <CheckoutForm {...defaultProps} className="custom-class" />
    );
    
    const form = container.querySelector('.vkecom-checkout-form');
    expect(form?.classList.contains('custom-class')).toBe(true);
  });
});


