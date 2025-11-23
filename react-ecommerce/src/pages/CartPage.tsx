import { Link } from 'react-router-dom';
import { CartView, CartSummary } from '@alejandrovrod/blocks-react';

export default function CartPage() {

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <CartView
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            cartOptions={{ persist: true }}
            emptyMessage={
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Your Cart is Empty
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Add some products to your cart to get started
                </p>
                <Link
                  to="/products"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition-colors"
                >
                  Browse Products
                </Link>
              </div>
            }
            itemProps={{
              className: 'border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4',
              renderImage: (item) => (
                <div className="w-24 h-24 flex-shrink-0">
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                      No image
                    </div>
                  )}
                </div>
              ),
              renderTitle: (item) => (
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {item.product.name}
                </h3>
              ),
              renderPrice: (item) => (
                <div className="text-gray-700 dark:text-gray-300 mt-2">
                  <span className="font-semibold">
                    ${item.product.price.toFixed(2)} each
                  </span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    × {item.quantity} = ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ),
            }}
          />
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Order Summary
            </h2>
            <CartSummary
              cartOptions={{ persist: true }}
              showTax={true}
              taxRate={0.1}
              renderItemCount={(count) => (
                <div className="flex justify-between text-gray-600 dark:text-gray-400 mb-2">
                  <span>Items ({count})</span>
                </div>
              )}
              renderSubtotal={(subtotal) => (
                <div className="flex justify-between text-gray-600 dark:text-gray-400 mb-2">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              )}
              renderTax={(tax) => (
                <div className="flex justify-between text-gray-600 dark:text-gray-400 mb-2">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              )}
              renderTotal={(finalTotal) => (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                  <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              )}
              renderCheckout={(onCheckout) => (
                <Link
                  to="/checkout"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded text-center transition-colors mt-4"
                  onClick={onCheckout}
                >
                  Proceed to Checkout
                </Link>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

