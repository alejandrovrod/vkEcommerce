import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  useProducts,
  useCart,
  WishlistButton,
  ShippingCalculator,
  ProductCard,
} from '@alejandrovrod/blocks-react';
import { mockProducts } from '../data/mockProducts';
import type { ShippingRate } from '@alejandrovrod/blocks-core';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart({ persist: true });
  const [quantity, setQuantity] = useState(1);
  const [selectedShippingRate, setSelectedShippingRate] = useState<ShippingRate | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Initialize products manager with mock data
  const { getProductById, getProductsByCategory } = useProducts({
    products: mockProducts,
  });

  const product = id ? getProductById(id) : undefined;

  // Get related products (same category, excluding current product)
  const relatedProducts = product && product.categoryId && typeof product.categoryId === 'string'
    ? getProductsByCategory(product.categoryId).filter((p) => p.id !== product.id).slice(0, 4)
    : [];

  // Create image gallery (using main image + some variations for demo)
  const productImages = product
    ? [
        product.image || '',
        product.image?.replace('?w=500', '?w=800') || '',
        product.image?.replace('?w=500', '?w=600') || '',
      ].filter(Boolean)
    : [];

  if (!product) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Product Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The product you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate('/products')}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition-colors"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  // Prepare shipping items
  const shippingItems = [
    {
      weight: typeof product.weight === 'number' ? product.weight : 0.5,
      dimensions:
        product.dimensions &&
        typeof product.dimensions === 'object' &&
        'length' in product.dimensions &&
        typeof product.dimensions.length === 'number' &&
        'width' in product.dimensions &&
        typeof product.dimensions.width === 'number' &&
        'height' in product.dimensions &&
        typeof product.dimensions.height === 'number'
          ? {
              length: product.dimensions.length,
              width: product.dimensions.width,
              height: product.dimensions.height,
            }
          : { length: 10, width: 10, height: 10 },
      quantity: quantity,
      value: product.price,
    },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-600 dark:text-gray-400">
        <button
          onClick={() => navigate('/products')}
          className="hover:text-blue-600 dark:hover:text-blue-400"
        >
          Products
        </button>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div>
          <div className="mb-4">
            <div className="vkecom-product-image rounded-lg overflow-hidden">
              {productImages[selectedImageIndex] ? (
                <img
                  src={productImages[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  No image
                </div>
              )}
            </div>
          </div>
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  className={`border-2 rounded overflow-hidden transition-all ${
                    selectedImageIndex === index
                      ? 'border-blue-600 dark:border-blue-400'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {product.name}
          </h1>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                ${product.price.toFixed(2)}
              </span>
              {typeof product.compareAtPrice === 'number' &&
                product.compareAtPrice > product.price && (
                  <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                    ${product.compareAtPrice.toFixed(2)}
                  </span>
                )}
            </div>
            {typeof product.compareAtPrice === 'number' &&
              product.compareAtPrice > product.price && (
                <span className="text-sm text-red-600 dark:text-red-400 font-semibold">
                  Save ${(product.compareAtPrice - product.price).toFixed(2)} (
                  {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                  off)
                </span>
              )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Description
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Product Details */}
          <div className="mb-6 space-y-2 text-sm">
            {typeof product.sku === 'string' && product.sku && (
              <div className="flex">
                <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">SKU:</span>
                <span className="text-gray-600 dark:text-gray-400">{product.sku}</span>
              </div>
            )}
            {product.stock !== undefined && typeof product.stock === 'number' && (
              <div className="flex">
                <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">Stock:</span>
                <span
                  className={`${
                    product.inStock ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {product.inStock ? `${product.stock} available` : 'Out of stock'}
                </span>
              </div>
            )}
            {Array.isArray(product.tags) && product.tags.length > 0 && (
              <div className="flex">
                <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Quantity
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded flex items-center justify-center font-semibold"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={typeof product.stock === 'number' ? product.stock : 99}
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val) && val >= 1) {
                    const maxStock = typeof product.stock === 'number' ? product.stock : 99;
                    setQuantity(Math.min(val, maxStock));
                  }
                }}
                className="w-20 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2"
              />
              <button
                type="button"
                onClick={() => {
                  const maxStock = typeof product.stock === 'number' ? product.stock : 99;
                  setQuantity(Math.min(quantity + 1, maxStock));
                }}
                className="w-10 h-10 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded flex items-center justify-center font-semibold"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart & Wishlist */}
          <div className="mb-6 flex gap-4">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded transition-colors"
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <WishlistButton
              product={product}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
            />
          </div>

          {/* Shipping Calculator */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Calculate Shipping
            </h3>
            <ShippingCalculator
              items={shippingItems}
              onRatesCalculated={(rates) => {
                if (rates.length > 0 && !selectedShippingRate) {
                  setSelectedShippingRate(rates[0]);
                }
              }}
              renderRates={({ rates, loading }) => {
                if (loading) {
                  return <p className="text-gray-600 dark:text-gray-400">Calculating...</p>;
                }
                if (rates.length === 0) {
                  return (
                    <p className="text-gray-600 dark:text-gray-400">
                      Enter an address to calculate shipping
                    </p>
                  );
                }
                return (
                  <div className="space-y-2">
                    {rates.map((rate) => (
                      <div
                        key={rate.option.id}
                        className={`p-3 border-2 rounded cursor-pointer transition-colors ${
                          selectedShippingRate?.option.id === rate.option.id
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                        }`}
                        onClick={() => setSelectedShippingRate(rate)}
                      >
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
                      </div>
                    ))}
                  </div>
                );
              }}
            />
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
                className="h-full cursor-pointer"
                renderImage={(product) => (
                  <div
                    className="vkecom-product-image"
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
                    {typeof product.compareAtPrice === 'number' &&
                      product.compareAtPrice > product.price ? (
                        <div className="flex items-center gap-2">
                          <span className="text-red-600 line-through text-sm">
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

