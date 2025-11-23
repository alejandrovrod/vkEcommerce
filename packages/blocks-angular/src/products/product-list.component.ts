/**
 * Product list component
 */

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Product } from '@vk/blocks-core';

@Component({
  selector: 'vk-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
})
export class ProductListComponent {
  @Input() products!: Product[];
  @Input() className?: string;
  @Input() emptyMessage = 'No products found';

  trackByProductId(_index: number, product: Product): string {
    return product.id;
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }
}
