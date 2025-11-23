/**
 * Product search component
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductSearchService } from './product-search.service';
import type { SearchOptions } from '@alejandrovrod/blocks-core';

@Component({
  selector: 'vk-product-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-search.component.html',
})
export class ProductSearchComponent {
  @Input() initialQuery?: string;
  @Input() initialOptions?: SearchOptions;
  @Output() search = new EventEmitter<{ query: string; options: SearchOptions }>();
  @Input() className?: string;
  @Input() placeholder = 'Search products...';

  localQuery = '';

  constructor(private searchService: ProductSearchService) {
    if (this.initialQuery) {
      this.localQuery = this.initialQuery;
      this.searchService.setQuery(this.initialQuery);
    }
    if (this.initialOptions) {
      this.searchService.setOptions(this.initialOptions);
    }
  }

  handleSubmit(): void {
    this.searchService.setQuery(this.localQuery);
    this.search.emit({
      query: this.localQuery,
      options: this.searchService.options(),
    });
  }
}


