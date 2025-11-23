/**
 * Cart history view component
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartHistoryService } from '../services/cart-history.service';
import type { CartHistoryEntry, CartHistoryOptions } from '@alejandrovrod/blocks-core';

@Component({
  selector: 'vk-cart-history-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-history-view.component.html',
})
export class CartHistoryViewComponent {
  @Input() className?: string;
  @Input() historyOptions?: CartHistoryOptions;
  @Output() restore = new EventEmitter<CartHistoryEntry>();
  @Input() emptyMessage = 'No cart history';

  constructor(public historyService: CartHistoryService) {
    if (this.historyOptions) {
      // Recreate service with new options if provided
      // Note: In a real implementation, you might want to handle this differently
    }
  }

  handleRestore(entry: CartHistoryEntry): void {
    const restored = this.historyService.restoreState(entry.id);
    if (restored) {
      this.restore.emit(entry);
    }
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  formatCartHistoryEntry(entry: CartHistoryEntry): string {
    return `${entry.state.itemCount} items - ${this.formatPrice(entry.state.total)}`;
  }
}

