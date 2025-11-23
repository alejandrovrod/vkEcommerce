import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckoutForm,
  useCart,
  ShippingCalculator,
  PaymentMethodSelector,
  MercadoPagoButton,
  AddressForm,
  ShippingOptions,
} from '@alejandrovrod/blocks-react';
import type { ShippingRate } from '@alejandrovrod/blocks-core';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { total, itemCount, items, clear } = useCart({ persist: true });
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [selectedShippingRate, setSelectedShippingRate] = useState<ShippingRate | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  
  // Mercado Pago public key (en producción debería venir de variables de entorno)
  const MERCADO_PAGO_PUBLIC_KEY = 'TEST-12345678-1234-1234-1234-123456789012';

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
                  <AddressForm
                    initialAddress={shippingAddress}
                    onSubmit={(address) => {
                      onShippingChange(address);
                    }}
                    renderFields={({ address, onChange: onAddressChange, errors }) => {
                      // Sync address changes with CheckoutForm
                      const handleChange = (newAddress: Partial<typeof address>) => {
                        const updatedAddress = { ...address, ...newAddress };
                        onAddressChange(updatedAddress);
                        onShippingChange(updatedAddress as any);
                      };
                      
                      return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <input
                            type="text"
                            placeholder="Recipient Name"
                            value={address.recipientName || ''}
                            onChange={(e) => handleChange({ recipientName: e.target.value })}
                            className={`vkecom-checkout-field ${errors.some(e => e.field === 'recipientName') ? 'border-red-500' : ''}`}
                          />
                          {errors.find(e => e.field === 'recipientName') && (
                            <p className="text-red-500 text-sm mt-1">{errors.find(e => e.field === 'recipientName')?.message}</p>
                          )}
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Street Address"
                            value={address.street || ''}
                            onChange={(e) => handleChange({ street: e.target.value })}
                            className={`vkecom-checkout-field ${errors.some(e => e.field === 'street') ? 'border-red-500' : ''}`}
                          />
                          {errors.find(e => e.field === 'street') && (
                            <p className="text-red-500 text-sm mt-1">{errors.find(e => e.field === 'street')?.message}</p>
                          )}
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="City"
                            value={address.city || ''}
                            onChange={(e) => handleChange({ city: e.target.value })}
                            className={`vkecom-checkout-field ${errors.some(e => e.field === 'city') ? 'border-red-500' : ''}`}
                          />
                          {errors.find(e => e.field === 'city') && (
                            <p className="text-red-500 text-sm mt-1">{errors.find(e => e.field === 'city')?.message}</p>
                          )}
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Postal Code"
                            value={address.postalCode || ''}
                            onChange={(e) => handleChange({ postalCode: e.target.value })}
                            className={`vkecom-checkout-field ${errors.some(e => e.field === 'postalCode') ? 'border-red-500' : ''}`}
                          />
                          {errors.find(e => e.field === 'postalCode') && (
                            <p className="text-red-500 text-sm mt-1">{errors.find(e => e.field === 'postalCode')?.message}</p>
                          )}
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Country"
                            value={address.country || ''}
                            onChange={(e) => handleChange({ country: e.target.value })}
                            className={`vkecom-checkout-field ${errors.some(e => e.field === 'country') ? 'border-red-500' : ''}`}
                          />
                          {errors.find(e => e.field === 'country') && (
                            <p className="text-red-500 text-sm mt-1">{errors.find(e => e.field === 'country')?.message}</p>
                          )}
                        </div>
                        {address.phone && (
                          <div>
                            <input
                              type="tel"
                              placeholder="Phone (optional)"
                              value={address.phone || ''}
                              onChange={(e) => handleChange({ phone: e.target.value })}
                              className="vkecom-checkout-field"
                            />
                          </div>
                        )}
                      </div>
                      );
                    }}
                  />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Payment Method
                  </h2>
                  <PaymentMethodSelector
                    value={paymentMethod.method ? { method: paymentMethod.method } : undefined}
                    onChange={(method) => {
                      setSelectedPaymentMethod(method.method || '');
                      onPaymentChange(method);
                    }}
                    renderMethod={(method, selected, onSelect) => (
                      <label
                        className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          selected
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment-method"
                          checked={selected}
                          onChange={onSelect}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-900 dark:text-white font-medium">
                          {method === 'credit_card' && '💳 Credit Card'}
                          {method === 'debit_card' && '💳 Debit Card'}
                          {method === 'bank_transfer' && '🏦 Bank Transfer'}
                          {method === 'cash' && '💵 Cash'}
                          {method === 'digital_wallet' && '📱 Digital Wallet'}
                          {method === 'mercado_pago' && '🛒 Mercado Pago'}
                        </span>
                      </label>
                    )}
                    className="space-y-2"
                  />
                  
                  {selectedPaymentMethod === 'mercado_pago' && (
                    <div className="mt-4">
                      <MercadoPagoButton
                        publicKey={MERCADO_PAGO_PUBLIC_KEY}
                        label="Pay with Mercado Pago"
                        onSuccess={(paymentId) => {
                          console.log('Mercado Pago payment successful:', paymentId);
                          clear();
                          setCheckoutComplete(true);
                        }}
                        onError={(error) => {
                          console.error('Mercado Pago error:', error);
                          alert(`Payment error: ${error.message}`);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded transition-colors"
                      />
                    </div>
                  )}
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
              {selectedShippingRate && (
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping ({selectedShippingRate.option.name})</span>
                  <span>${selectedShippingRate.cost.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span>${((total * 1.1) + (selectedShippingRate?.cost || 0)).toFixed(2)}</span>
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
                // Auto-select cheapest rate
                if (rates.length > 0 && !selectedShippingRate) {
                  const cheapest = rates.reduce((prev, current) => 
                    prev.cost < current.cost ? prev : current
                  );
                  setSelectedShippingRate(cheapest);
                }
              }}
              renderRates={({ rates, loading, onSelect }) => {
                if (loading) {
                  return <p className="text-gray-600 dark:text-gray-400">Calculating shipping...</p>;
                }
                if (rates.length === 0) {
                  return null;
                }
                return (
                  <div className="mt-4">
                    <ShippingOptions
                      rates={rates}
                      selectedRateId={selectedShippingRate?.option.id}
                      onSelect={(rate) => {
                        setSelectedShippingRate(rate);
                        onSelect(rate);
                      }}
                      renderRate={(rate, selected, onSelect) => (
                        <label
                          className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors mb-2 ${
                            selected
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                          }`}
                        >
                          <input
                            type="radio"
                            name="shipping-option"
                            checked={selected}
                            onChange={onSelect}
                            className="mr-2"
                          />
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-white">
                                {rate.option.name}
                              </div>
                              {rate.estimatedDays && (
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {rate.estimatedDays.min}-{rate.estimatedDays.max} days
                                </div>
                              )}
                            </div>
                            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                              ${rate.cost.toFixed(2)} {rate.currency}
                            </div>
                          </div>
                        </label>
                      )}
                    />
                  </div>
                );
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

