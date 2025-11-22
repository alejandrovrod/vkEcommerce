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
  template: `
    <div [class]="'vkecom-shipping-calculator ' + (className || '')">
      <form (ngSubmit)="handleSubmit()">
        <div class="vkecom-shipping-address-form">
          <input
            type="text"
            placeholder="Street"
            [(ngModel)]="address.street"
            name="street"
            class="vkecom-shipping-field"
          />
          <input
            type="text"
            placeholder="City"
            [(ngModel)]="address.city"
            name="city"
            class="vkecom-shipping-field"
          />
          <input
            type="text"
            placeholder="Postal Code"
            [(ngModel)]="address.postalCode"
            name="postalCode"
            class="vkecom-shipping-field"
          />
          <input
            type="text"
            placeholder="Country"
            [(ngModel)]="address.country"
            name="country"
            class="vkecom-shipping-field"
          />
          <button
            type="submit"
            [disabled]="shipping.loading()"
            class="vkecom-shipping-calculate-button"
          >
            {{ shipping.loading() ? 'Calculating...' : 'Calculate Shipping' }}
          </button>
        </div>

        <div *ngIf="shipping.error()" class="vkecom-shipping-error">
          {{ shipping.error()?.message }}
        </div>
      </form>

      <div *ngIf="shipping.rates().length > 0" class="vkecom-shipping-rates">
        <h3>Shipping Options</h3>
        <div
          *ngFor="let rate of shipping.rates()"
          class="vkecom-shipping-rate"
        >
          <div class="vkecom-shipping-rate-name">{{ rate.option.name }}</div>
          <div class="vkecom-shipping-rate-cost">
            ${{ rate.cost.toFixed(2) }} {{ rate.currency }}
          </div>
          <div *ngIf="rate.estimatedDays" class="vkecom-shipping-rate-days">
            {{ rate.estimatedDays.min }}-{{ rate.estimatedDays.max }} days
          </div>
        </div>
      </div>
    </div>
  `,
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

  constructor(public shipping: ShippingService) {}

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

