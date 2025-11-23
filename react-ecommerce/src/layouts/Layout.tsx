import { Link, useLocation, Outlet } from 'react-router-dom';
import { useCart } from '@alejandrovrod/blocks-react';
import { useWishlist } from '@alejandrovrod/blocks-react';

export default function Layout() {
  const location = useLocation();
  const { itemCount } = useCart({ persist: true });
  const { items: wishlistItems } = useWishlist();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link
                to="/"
                className="flex items-center px-2 py-2 text-xl font-bold text-blue-600 dark:text-blue-400"
              >
                E-commerce Store
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/products"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/products')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Products
              </Link>
              <Link
                to="/wishlist"
                className={`relative px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/wishlist')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Wishlist
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                className={`relative px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/cart')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Cart
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            React E-commerce Example - Built with @alejandrovrod/blocks-react
          </p>
        </div>
      </footer>
    </div>
  );
}


