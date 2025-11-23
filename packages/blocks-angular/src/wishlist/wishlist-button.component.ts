/**
 * Wishlist button component
 */

import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from './wishlist.service';
import type { Product } from '@vk/blocks-core';

@Component({
  selector: 'vk-wishlist-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist-button.component.html',
})
export class WishlistButtonComponent {
  @Input() product!: Product;
  @Input() className?: string;
  @Input() inWishlistLabel = 'Remove from Wishlist';
  @Input() notInWishlistLabel = 'Add to Wishlist';
  @Output() add = new EventEmitter<Product>();
  @Output() remove = new EventEmitter<string>();

  inWishlist = computed(() => this.wishlist.hasProduct(this.product.id));

  constructor(public wishlist: WishlistService) {}

  handleClick(): void {
    if (this.inWishlist()) {
      this.wishlist.removeProduct(this.product.id);
      this.remove.emit(this.product.id);
    } else {
      this.wishlist.addItem(this.product);
      this.add.emit(this.product);
    }
  }
}

