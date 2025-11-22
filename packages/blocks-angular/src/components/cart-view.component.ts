import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { CartSyncService } from '../services/cart-sync.service';
import { CartItemComponent } from './cart-item.component';
import type { CartSyncOptions, CartHistoryOptions } from '@vk/blocks-core';

/**
 * CartView component - Displays the full cart with all items
 * Fully customizable via CSS classes
 */
@Component({
  selector: 'vk-cart-view',
  standalone: true,
  imports: [CommonModule, CartItemComponent],
  templateUrl: './cart-view.component.html',
})
export class CartViewComponent implements OnInit, OnDestroy {
  @Input() className?: string;
  @Input() emptyMessage = 'Your cart is empty';
  @Input() showHeader = true;
  @Input() enableSync = false;
  @Input() syncOptions?: CartSyncOptions;
  @Input() enableHistory = false;
  @Input() historyOptions?: CartHistoryOptions;

  // Use signals from the service
  items;

  constructor(
    public cartService: CartService,
    private cartSyncService: CartSyncService
  ) {
    this.items = this.cartService.items;
  }

  ngOnInit(): void {
    if (this.enableSync) {
      this.cartSyncService.initialize(this.syncOptions);
    }
  }

  ngOnDestroy(): void {
    if (this.enableSync) {
      this.cartSyncService.stop();
    }
  }

  handleIncrease(itemId: string): void {
    const item = this.items().find((i) => i.id === itemId);
    if (item) {
      this.cartService.updateQuantity(itemId, item.quantity + 1);
    }
  }

  handleDecrease(itemId: string): void {
    const item = this.items().find((i) => i.id === itemId);
    if (item) {
      if (item.quantity > 1) {
        this.cartService.updateQuantity(itemId, item.quantity - 1);
      } else {
        this.cartService.removeItem(itemId);
      }
    }
  }

  handleRemove(itemId: string): void {
    this.cartService.removeItem(itemId);
  }
}

