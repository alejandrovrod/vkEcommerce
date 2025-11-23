import { useNavigate } from 'react-router-dom';
import { CartHistoryView, useCart, useCartHistory } from '@alejandrovrod/blocks-react';
import type { CartHistoryEntry } from '@alejandrovrod/blocks-core';

export default function CartHistoryPage() {
  const navigate = useNavigate();
  const { addItem, clear } = useCart({ persist: true });
  const history = useCartHistory({
    persist: true,
    maxEntries: 10,
  });

  const handleRestore = (entry: CartHistoryEntry) => {
    // Restore the cart state from history
    const restored = history.restoreState(entry.id);
    
    if (restored) {
      // Clear current cart first
      clear();
      
      // Restore items from history
      if (entry.state.items) {
        entry.state.items.forEach((item) => {
          addItem(item.product, item.quantity);
        });
      }
      
      // Navigate to cart page
      navigate('/cart');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Cart History
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          View and restore your previous carts
        </p>
      </div>

      <CartHistoryView
        historyOptions={{
          persist: true,
          maxEntries: 10,
        }}
        onRestore={handleRestore}
        emptyMessage="No cart history available"
        renderEmpty={() => (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No Cart History
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your saved carts will appear here
            </p>
            <button
              onClick={() => navigate('/products')}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition-colors"
            >
              Browse Products
            </button>
          </div>
        )}
        renderEntry={(entry, onRestore, onRemove) => (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                {entry.label && (
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {entry.label}
                  </h3>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {new Date(entry.timestamp).toLocaleString()}
                </p>
                <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>{entry.state.itemCount} items</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${entry.state.total.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onRestore}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                >
                  Restore
                </button>
                <button
                  type="button"
                  onClick={onRemove}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
            {entry.metadata && Object.keys(entry.metadata).length > 0 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {JSON.stringify(entry.metadata)}
              </div>
            )}
          </div>
        )}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
      />
    </div>
  );
}

