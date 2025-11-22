/**
 * Product filters component
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { ProductFilter } from '@vk/blocks-core';

@Component({
  selector: 'vk-product-filters',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'vkecom-product-filters ' + (className || '')">
      <div class="vkecom-product-filters-section">
        <h3>Price Range</h3>
        <input
          type="number"
          placeholder="Min"
          [value]="filters.priceRange?.min || ''"
          (input)="handlePriceMinChange($event)"
          class="vkecom-product-filters-input"
        />
        <input
          type="number"
          placeholder="Max"
          [value]="filters.priceRange?.max || ''"
          (input)="handlePriceMaxChange($event)"
          class="vkecom-product-filters-input"
        />
      </div>

      <div
        *ngIf="facets?.categories && facets.categories.length > 0"
        class="vkecom-product-filters-section"
      >
        <h3>Categories</h3>
        <label
          *ngFor="let category of facets.categories"
          class="vkecom-product-filters-checkbox"
        >
          <input
            type="checkbox"
            [checked]="filters.categories?.includes(category.id) || false"
            (change)="handleCategoryToggle(category.id)"
          />
          <span>{{ category.name }} ({{ category.count }})</span>
        </label>
      </div>

      <div
        *ngIf="facets?.tags && facets.tags.length > 0"
        class="vkecom-product-filters-section"
      >
        <h3>Tags</h3>
        <label *ngFor="let tagItem of facets.tags" class="vkecom-product-filters-checkbox">
          <input
            type="checkbox"
            [checked]="filters.tags?.includes(tagItem.tag) || false"
            (change)="handleTagToggle(tagItem.tag)"
          />
          <span>{{ tagItem.tag }} ({{ tagItem.count }})</span>
        </label>
      </div>

      <div class="vkecom-product-filters-section">
        <label class="vkecom-product-filters-checkbox">
          <input
            type="checkbox"
            [checked]="filters.inStock === true"
            (change)="handleStockToggle()"
          />
          <span>In Stock Only</span>
        </label>
      </div>
    </div>
  `,
})
export class ProductFiltersComponent {
  @Input() filters!: ProductFilter;
  @Input() facets?: {
    categories?: Array<{ id: string; name: string; count: number }>;
    priceRanges?: Array<{ min: number; max: number; count: number }>;
    tags?: Array<{ tag: string; count: number }>;
  };
  @Output() change = new EventEmitter<ProductFilter>();
  @Input() className?: string;

  handlePriceMinChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.change.emit({
      ...this.filters,
      priceRange: {
        min: target.value ? parseFloat(target.value) : undefined,
        max: this.filters.priceRange?.max,
      },
    });
  }

  handlePriceMaxChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.change.emit({
      ...this.filters,
      priceRange: {
        min: this.filters.priceRange?.min,
        max: target.value ? parseFloat(target.value) : undefined,
      },
    });
  }

  handleCategoryToggle(categoryId: string): void {
    const currentCategories = this.filters.categories || [];
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter((id) => id !== categoryId)
      : [...currentCategories, categoryId];

    this.change.emit({
      ...this.filters,
      categories: newCategories.length > 0 ? newCategories : undefined,
    });
  }

  handleTagToggle(tag: string): void {
    const currentTags = this.filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];

    this.change.emit({
      ...this.filters,
      tags: newTags.length > 0 ? newTags : undefined,
    });
  }

  handleStockToggle(): void {
    this.change.emit({
      ...this.filters,
      inStock: this.filters.inStock === true ? undefined : true,
    });
  }
}

