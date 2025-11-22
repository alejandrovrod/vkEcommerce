/**
 * Cart history view component
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartHistoryService } from '../services/cart-history.service';
import type { CartHistoryEntry, CartHistoryOptions } from '@vk/blocks-core';

@Component({
  selector: 'vk-cart-history-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'vkecom-cart-history ' + (className || '')">
      <div *ngIf="historyService.entries().length === 0" class="vkecom-cart-history-empty">
        <p>{{ emptyMessage }}</p>
      </div>
      <div *ngIf="historyService.entries().length > 0">
        <h3 class="vkecom-cart-history-title">Cart History</h3>
        <ul class="vkecom-cart-history-list" role="list">
          <li
            *ngFor="let entry of historyService.entries()"
            class="vkecom-cart-history-entry"
            role="listitem"
          >
            <div class="vkecom-cart-history-entry-content">
              <div class="vkecom-cart-history-entry-info">
                <div *ngIf="entry.label" class="vkecom-cart-history-entry-label">
                  {{ entry.label }}
                </div>
                <div class="vkecom-cart-history-entry-date">
                  {{ entry.timestamp | date : 'short' }}
                </div>
                <div class="vkecom-cart-history-entry-items">
                  {{ entry.state.itemCount }} items - {{ '$' + formatPrice(entry.state.total) }}
                </div>
              </div>
              <div class="vkecom-cart-history-entry-actions">
                <button
                  type="button"
                  (click)="handleRestore(entry)"
                  class="vkecom-cart-history-entry-restore"
                >
                  Restore
                </button>
                <button
                  type="button"
                  (click)="historyService.removeEntry(entry.id)"
                  class="vkecom-cart-history-entry-remove"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  `,
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
    return price.toFixed(2);
  }
}

