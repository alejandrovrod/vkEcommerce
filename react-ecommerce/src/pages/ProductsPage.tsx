import { useState } from 'react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ProductList,
  ProductCard,
  ProductSearch,
  ProductFilters,
  useProducts,
  WishlistButton,
} from '@alejandrovrod/blocks-react';
import { mockProducts } from '../data/mockProducts';
import type { ProductFilter } from '@alejandrovrod/blocks-core';

export default function ProductsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQueryState] = useState('');
  const [filters, setFiltersState] = useState<ProductFilter>({});

  // Initialize products manager with mock data
  const { products, setSearchQuery, setFilters } = useProducts({
    products: mockProducts,
  });

  // Apply search and filters
  React.useEffect(() => {
    setSearchQuery(searchQuery);
  }, [searchQuery, setSearchQuery]);

  React.useEffect(() => {
    setFilters(filters);
  }, [filters, setFilters]);

  const displayedProducts = products;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          All Products
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Browse our complete catalog
        </p>
      </div>

      <div className="mb-6">
        <ProductSearch
          initialQuery={searchQuery}
          onSearch={(query) => setSearchQueryState(query)}
          placeholder="Search products..."
          className="w-full max-w-md"
        />
      </div>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <div className="w-64 flex-shrink-0">
          <ProductFilters
            filters={filters}
            onFiltersChange={setFiltersState}
            facets={{
              categories: [
                { id: 'electronics', name: 'Electronics', count: 5 },
                { id: 'accessories', name: 'Accessories', count: 5 },
              ],
              tags: [
                { tag: 'gaming', count: 2 },
                { tag: 'office', count: 3 },
                { tag: 'travel', count: 1 },
              ],
              priceRanges: [
                { min: 0, max: 50, count: 3 },
                { min: 50, max: 100, count: 4 },
                { min: 100, max: 500, count: 3 },
              ],
            }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
          />
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-400">
              Showing {displayedProducts.length} products
            </p>
          </div>
          <ProductList
            products={displayedProducts}
            renderProduct={(product) => (
              <div className="mb-4">
                <ProductCard
                  product={product}
                  className="h-full"
                  renderImage={(product) => (
                    <div
                      className="vkecom-product-image cursor-pointer"
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          No image
                        </div>
                      )}
                    </div>
                  )}
                  renderTitle={(product) => (
                    <h3
                      className="vkecom-product-title cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      {product.name}
                    </h3>
                  )}
                  renderPrice={(product) => (
                    <div className="vkecom-product-price">
                      {typeof product.compareAtPrice === 'number' && product.compareAtPrice > product.price ? (
                        <div className="flex items-center gap-2">
                          <span className="text-red-600 line-through">
                            ${product.compareAtPrice.toFixed(2)}
                          </span>
                          <span>${product.price.toFixed(2)}</span>
                        </div>
                      ) : (
                        <span>${product.price.toFixed(2)}</span>
                      )}
                    </div>
                  )}
                  renderButton={(product, onAddToCart) => (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="vkecom-product-button flex-1"
                        onClick={onAddToCart}
                      >
                        Add to Cart
                      </button>
                      <WishlistButton
                        product={product}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
                      />
                    </div>
                  )}
                />
              </div>
            )}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          />
        </div>
      </div>
    </div>
  );
}

