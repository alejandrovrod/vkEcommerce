# React E-commerce Example Application

This is a complete example application demonstrating the usage of `@alejandrovrod/blocks-react` and `@alejandrovrod/blocks-core` packages.

## Features

- **Product Catalog**: Browse products with search and filtering
- **Shopping Cart**: Add/remove items, update quantities, view cart summary
- **Wishlist**: Save products for later
- **Checkout**: Complete checkout flow with shipping calculator
- **Responsive Design**: Built with Tailwind CSS

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router** for navigation
- **Tailwind CSS** for styling
- **@alejandrovrod/blocks-core**: Core e-commerce logic
- **@alejandrovrod/blocks-react**: React hooks and components

## Installation

1. **Create a GitHub Personal Access Token**:

   You need a GitHub Personal Access Token (PAT) with `read:packages` scope:
   
   1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   2. Click "Generate new token (classic)"
   3. Give it a name (e.g., "npm-packages-read")
   4. Select the `read:packages` scope
   5. Click "Generate token"
   6. **Copy the token immediately** (you won't be able to see it again)

2. **Configure the token as an environment variable**:

   **Windows (PowerShell):**
   ```powershell
   $env:GITHUB_TOKEN="your_token_here"
   ```

   **Windows (CMD):**
   ```cmd
   set GITHUB_TOKEN=your_token_here
   ```

   **Linux/Mac:**
   ```bash
   export GITHUB_TOKEN=your_token_here
   ```

   **Note:** To make it permanent, add it to your shell profile (`.bashrc`, `.zshrc`, etc.) or use Windows environment variables.

   **Windows Quick Setup (PowerShell):**
   ```powershell
   .\setup-token.ps1
   ```
   This script will prompt you for your token and set it up.

3. **Install dependencies**:

   ```bash
   npm install
   # or
   pnpm install
   ```

   The `.npmrc` file is already configured to use the `GITHUB_TOKEN` environment variable.

## Quick Setup (Windows)

For Windows users, you can use the provided PowerShell script:

```powershell
.\setup-token.ps1
```

This will prompt you for your GitHub token and configure it automatically.

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
react-ecommerce/
├── src/
│   ├── components/       # Reusable components
│   ├── data/            # Mock data
│   ├── layouts/         # Layout components
│   ├── pages/           # Page components
│   ├── App.tsx          # Main app component with routing
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles with Tailwind
├── .npmrc               # GitHub Packages configuration
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## Components Used

### From @alejandrovrod/blocks-react

- **ProductCard**: Display individual products
- **ProductList**: Display list of products
- **ProductSearch**: Search products
- **ProductFilters**: Filter products
- **CartView**: Display cart items
- **CartSummary**: Display cart totals
- **CartItem**: Individual cart item
- **CheckoutForm**: Checkout form
- **WishlistView**: Display wishlist
- **WishlistButton**: Add/remove from wishlist
- **ShippingCalculator**: Calculate shipping rates

### Hooks Used

- **useCart**: Manage shopping cart
- **useProducts**: Manage products
- **useWishlist**: Manage wishlist
- **useCheckout**: Handle checkout process
- **useShipping**: Calculate shipping

## Pages

1. **Home Page** (`/`): Featured products
2. **Products Page** (`/products`): Full product catalog with search and filters
3. **Cart Page** (`/cart`): Shopping cart with summary
4. **Checkout Page** (`/checkout`): Checkout form and shipping calculator
5. **Wishlist Page** (`/wishlist`): Saved products

## Mock Data

The application includes mock product data in `src/data/mockProducts.ts` with 10 sample products including:
- Electronics (headphones, smartwatch, keyboard, mouse, webcam)
- Accessories (backpack, desk lamp, phone stand, monitor stand, USB-C hub)

## Customization

All components from `@alejandrovrod/blocks-react` are fully customizable through render props and className props. The example demonstrates:

- Custom rendering of product images, titles, prices, and buttons
- Custom cart item display
- Custom checkout form fields
- Tailwind CSS styling throughout

## Learn More

- [API Documentation](../../docs/API/react/README.md)
- [Installation Guide](../../docs/INSTALLATION.md)
- [Core API Documentation](../../docs/API/core/README.md)

