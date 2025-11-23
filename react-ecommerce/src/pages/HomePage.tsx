import { ProductList, ProductCard, WishlistButton } from '@alejandrovrod/blocks-react';
import { mockProducts } from '../data/mockProducts';

export default function HomePage() {
  // Show first 6 products on home page
  const featuredProducts = mockProducts.slice(0, 6);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome to Our Store
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Discover amazing products at great prices
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Featured Products
        </h2>
        <ProductList
          products={featuredProducts}
          renderProduct={(product) => (
            <div className="mb-4">
              <ProductCard
                product={product}
                className="h-full"
                renderImage={(product) => (
                  <div className="vkecom-product-image">
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
                  <h3 className="vkecom-product-title">{product.name}</h3>
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
  );
}

