/**
 * Shipping calculator component
 */

import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShippingService } from './shipping.service';
import type { ShippingAddress, ShippingCalculationRequest } from '@vk/blocks-core';

@Component({
  selector: 'vk-shipping-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shipping-calculator.component.html',
})
export class ShippingCalculatorComponent {
  @Input() items!: Array<{
    weight?: number;
    dimensions?: {
      length?: number;
      width?: number;
      height?: number;
    };
    quantity: number;
    value?: number;
  }>;
  @Input() className?: string;
  @Output() ratesCalculated = new EventEmitter<import('@vk/blocks-core').ShippingRate[]>();

  address = signal<Partial<ShippingAddress>>({});

  constructor(public shipping: ShippingService) { }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  async handleSubmit(): Promise<void> {
    if (
      !this.address().street ||
      !this.address().city ||
      !this.address().postalCode ||
      !this.address().country
    ) {
      return;
    }

    try {
      const request: ShippingCalculationRequest = {
        address: this.address() as ShippingAddress,
        items: this.items,
      };

      const result = await this.shipping.calculateRates(request);
      this.ratesCalculated.emit(result.rates);
    } catch (error) {
      // Error handled by service
    }
  }
}
