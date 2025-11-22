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
  template: `
    <div [class]="'vkecom-product-list ' + (className || '')">
      <div *ngIf="products.length === 0" class="vkecom-product-list-empty">
        <p>{{ emptyMessage }}</p>
      </div>
      <div *ngIf="products.length > 0" role="list">
          <div
            *ngFor="let product of products; let i = index; trackBy: trackByProductId"
            role="listitem"
            class="vkecom-product-list-item"
          >
          <div class="vkecom-product-item">
            <img
              *ngIf="product.image"
              [src]="product.image"
              [alt]="product.name"
              class="vkecom-product-item-image"
            />
            <div class="vkecom-product-item-details">
              <h3 class="vkecom-product-item-name">{{ product.name }}</h3>
              <p *ngIf="product.description" class="vkecom-product-item-description">
                {{ product.description }}
              </p>
              <div class="vkecom-product-item-price">${{ product.price.toFixed(2) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProductListComponent {
  @Input() products!: Product[];
  @Input() className?: string;
  @Input() emptyMessage = 'No products found';

  trackByProductId(index: number, product: Product): string {
    return product.id;
  }
}

