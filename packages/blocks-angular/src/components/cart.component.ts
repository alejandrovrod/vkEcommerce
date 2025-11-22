import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';

/**
 * Optional cart component - displays cart items
 * Fully customizable via CSS classes
 * Uses Angular Signals for reactive state
 */
@Component({
  selector: 'vk-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  // Use signals from the service
  state;
  items;
  total;
  itemCount;

  constructor(public cartService: CartService) {
    // Initialize signals after constructor
    this.state = this.cartService.state;
    this.items = this.cartService.items;
    this.total = this.cartService.total;
    this.itemCount = this.cartService.itemCount;
  }

  removeItem(itemId: string): void {
    this.cartService.removeItem(itemId);
  }

  increaseQuantity(itemId: string): void {
    const item = this.items().find((i: { id: string }) => i.id === itemId);
    if (item) {
      this.cartService.updateQuantity(itemId, item.quantity + 1);
    }
  }

  decreaseQuantity(itemId: string): void {
    const item = this.items().find((i: { id: string }) => i.id === itemId);
    if (item) {
      if (item.quantity > 1) {
        this.cartService.updateQuantity(itemId, item.quantity - 1);
      } else {
        this.cartService.removeItem(itemId);
      }
    }
  }

  clearCart(): void {
    this.cartService.clear();
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }
}

