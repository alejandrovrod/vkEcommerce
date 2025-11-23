import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckoutForm, useCart, ShippingCalculator } from '@alejandrovrod/blocks-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { total, itemCount, items, clear } = useCart({ persist: true });
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  if (itemCount === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Your Cart is Empty
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Add some products to your cart before checkout
        </p>
        <button
          onClick={() => navigate('/products')}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition-colors"
        >
          Browse Products
        </button>
      </div>
    );
  }

  if (checkoutComplete) {
    return (
      <div className="text-center py-12">
        <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded mb-4">
          <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
          <p>Thank you for your purchase. Your order has been received.</p>
        </div>
        <button
          onClick={() => {
            setCheckoutComplete(false);
            navigate('/products');
          }}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CheckoutForm
            subtotal={total}
            onComplete={(sessionId) => {
              console.log('Checkout completed with session:', sessionId);
              clear(); // Clear cart after successful checkout
              setCheckoutComplete(true);
            }}
            onError={(error) => {
              console.error('Checkout error:', error);
              alert(`Checkout error: ${error.message}`);
            }}
            renderFields={({ shippingAddress, paymentMethod, onShippingChange, onPaymentChange }) => (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Shipping Address
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={shippingAddress.street || ''}
                      onChange={(e) => onShippingChange({ ...shippingAddress, street: e.target.value })}
                      className="vkecom-checkout-field"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={shippingAddress.city || ''}
                      onChange={(e) => onShippingChange({ ...shippingAddress, city: e.target.value })}
                      className="vkecom-checkout-field"
                    />
                    <input
                      type="text"
                      placeholder="Postal Code"
                      value={shippingAddress.postalCode || ''}
                      onChange={(e) => onShippingChange({ ...shippingAddress, postalCode: e.target.value })}
                      className="vkecom-checkout-field"
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      value={shippingAddress.country || ''}
                      onChange={(e) => onShippingChange({ ...shippingAddress, country: e.target.value })}
                      className="vkecom-checkout-field"
                    />
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Payment Method
                  </h2>
                  <select
                    value={paymentMethod.method || ''}
                    onChange={(e) => onPaymentChange({ ...paymentMethod, method: e.target.value as any })}
                    className="vkecom-checkout-field"
                  >
                    <option value="">Select payment method</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="mercado_pago">Mercado Pago</option>
                  </select>
                </div>
              </div>
            )}
            renderSubmit={({ loading, disabled, onSubmit }) => (
              <button
                type="button"
                onClick={onSubmit}
                disabled={loading || disabled}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded transition-colors"
              >
                {loading ? 'Processing...' : 'Complete Order'}
              </button>
            )}
          />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Order Summary
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal ({itemCount} items)</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tax (10%)</span>
                <span>${(total * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span>${(total * 1.1).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Shipping Calculator
            </h2>
            <ShippingCalculator
              items={items.map(item => {
                const weight = typeof item.product.weight === 'number' ? item.product.weight : 0.5;
                const productDimensions = item.product.dimensions;
                let dimensions: { length: number; width: number; height: number };
                if (
                  productDimensions &&
                  typeof productDimensions === 'object' &&
                  typeof (productDimensions as any).length === 'number' &&
                  typeof (productDimensions as any).width === 'number' &&
                  typeof (productDimensions as any).height === 'number'
                ) {
                  dimensions = {
                    length: (productDimensions as any).length,
                    width: (productDimensions as any).width,
                    height: (productDimensions as any).height,
                  };
                } else {
                  dimensions = { length: 10, width: 10, height: 10 };
                }
                return {
                  weight,
                  dimensions,
                  quantity: item.quantity,
                  value: item.product.price,
                };
              })}
              onRatesCalculated={(rates) => {
                console.log('Shipping rates calculated:', rates);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

