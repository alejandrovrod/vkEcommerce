import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { CartItem as CartItemType } from '@vk/blocks-core';

/**
 * CartItem component - Displays a single cart item
 * Fully customizable via CSS classes
 */
@Component({
  selector: 'vk-cart-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-item.component.html',
})
export class CartItemComponent {
  @Input() item!: CartItemType;
  @Input() className?: string;
  @Output() increase = new EventEmitter<string>();
  @Output() decrease = new EventEmitter<string>();
  @Output() remove = new EventEmitter<string>();

  onIncrease(): void {
    this.increase.emit(this.item.id);
  }

  onDecrease(): void {
    this.decrease.emit(this.item.id);
  }

  onRemove(): void {
    this.remove.emit(this.item.id);
  }

  formatPrice(price: number): string {
    return price.toFixed(2);
  }
}
