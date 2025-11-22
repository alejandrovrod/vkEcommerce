/**
 * Wishlist view component
 */

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from './wishlist.service';

@Component({
  selector: 'vk-wishlist-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'vkecom-wishlist-view ' + (className || '')">
      <div *ngIf="wishlist.items().length === 0" class="vkecom-wishlist-view-empty">
        <p>{{ emptyMessage }}</p>
      </div>
      <div *ngIf="wishlist.items().length > 0">
        <div class="vkecom-wishlist-list" role="list">
          <div
            *ngFor="let item of wishlist.items()"
            [key]="item.id"
            role="listitem"
            class="vkecom-wishlist-item"
          >
            <div class="vkecom-wishlist-item-content">
              <img
                *ngIf="item.product.image"
                [src]="item.product.image"
                [alt]="item.product.name"
                class="vkecom-wishlist-item-image"
              />
              <div class="vkecom-wishlist-item-details">
                <h3 class="vkecom-wishlist-item-name">{{ item.product.name }}</h3>
                <p *ngIf="item.product.description" class="vkecom-wishlist-item-description">
                  {{ item.product.description }}
                </p>
                <div class="vkecom-wishlist-item-price">{{ '$' + formatPrice(item.product.price) }}</div>
              </div>
              <button
                type="button"
                (click)="wishlist.removeItem(item.id)"
                class="vkecom-wishlist-item-remove"
                [attr.aria-label]="'Remove ' + item.product.name + ' from wishlist'"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class WishlistViewComponent {
  @Input() className?: string;
  @Input() emptyMessage = 'Your wishlist is empty';

  constructor(public wishlist: WishlistService) {}

  formatPrice(price: number): string {
    return price.toFixed(2);
  }
}

