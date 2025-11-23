/**
 * Shipping options selector component
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { ShippingRate } from '@alejandrovrod/blocks-core';

@Component({
  selector: 'vk-shipping-options',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shipping-options.component.html',
})
export class ShippingOptionsComponent {
  @Input() rates!: ShippingRate[];
  @Input() selectedRateId?: string;
  @Output() select = new EventEmitter<ShippingRate>();
  @Input() className?: string;

  // Alias for select event (for template compatibility)
  onSelect = this.select;

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }
}

