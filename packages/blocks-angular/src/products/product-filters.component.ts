/**
 * Product filters component
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { ProductFilter } from '@alejandrovrod/blocks-core';

@Component({
  selector: 'vk-product-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-filters.component.html',
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


