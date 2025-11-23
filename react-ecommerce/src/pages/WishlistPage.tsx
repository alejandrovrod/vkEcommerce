import { Link } from 'react-router-dom';
import { WishlistView, WishlistButton, useWishlist, useCart } from '@alejandrovrod/blocks-react';

export default function WishlistPage() {
  const { items } = useWishlist();
  const { addItem } = useCart({ persist: true });

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Your Wishlist is Empty
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Add products to your wishlist to save them for later
        </p>
        <Link
          to="/products"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
        My Wishlist
      </h1>

      <WishlistView
        className="vkecom-wishlist-view"
        renderItem={(item, onRemove) => (
          <div className="vkecom-wishlist-item">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0">
                {item.product.image ? (
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {item.product.name}
                </h3>
                {item.product.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                    {item.product.description}
                  </p>
                )}
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  ${item.product.price.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => addItem(item.product, 1)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                Add to Cart
              </button>
              <WishlistButton
                product={item.product}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition-colors"
              />
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="text-red-600 hover:text-red-700 font-semibold"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      />
    </div>
  );
}

