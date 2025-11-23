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
  templateUrl: './wishlist-view.component.html',
})
export class WishlistViewComponent {
  @Input() className?: string;
  @Input() emptyMessage = 'Your wishlist is empty';

  constructor(public wishlist: WishlistService) { }

  trackByItemId(_index: number, item: { id: string }): string {
    return item.id;
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }
}

