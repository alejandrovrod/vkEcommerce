/**
 * Address form component
 */

import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { ShippingAddress } from '@vk/blocks-core';

@Component({
  selector: 'vk-address-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form
      [class]="'vkecom-address-form ' + (className || '')"
      (ngSubmit)="handleSubmit()"
    >
      <div class="vkecom-address-field">
        <label>
          Recipient Name *
          <input
            type="text"
            [(ngModel)]="address.recipientName"
            name="recipientName"
            [class]="['vkecom-address-input', { error: hasError('recipientName') }]"
          />
          <span *ngIf="showErrors && hasError('recipientName')" class="vkecom-address-error">
            {{ getError('recipientName') }}
          </span>
        </label>
      </div>

      <div class="vkecom-address-field">
        <label>
          Street *
          <input
            type="text"
            [(ngModel)]="address.street"
            name="street"
            [class]="['vkecom-address-input', { error: hasError('street') }]"
          />
          <span *ngIf="showErrors && hasError('street')" class="vkecom-address-error">
            {{ getError('street') }}
          </span>
        </label>
      </div>

      <div class="vkecom-address-field">
        <label>
          City *
          <input
            type="text"
            [(ngModel)]="address.city"
            name="city"
            [class]="['vkecom-address-input', { error: hasError('city') }]"
          />
          <span *ngIf="showErrors && hasError('city')" class="vkecom-address-error">
            {{ getError('city') }}
          </span>
        </label>
      </div>

      <div class="vkecom-address-field">
        <label>
          Postal Code *
          <input
            type="text"
            [(ngModel)]="address.postalCode"
            name="postalCode"
            [class]="['vkecom-address-input', { error: hasError('postalCode') }]"
          />
          <span *ngIf="showErrors && hasError('postalCode')" class="vkecom-address-error">
            {{ getError('postalCode') }}
          </span>
        </label>
      </div>

      <div class="vkecom-address-field">
        <label>
          Country *
          <input
            type="text"
            [(ngModel)]="address.country"
            name="country"
            [class]="['vkecom-address-input', { error: hasError('country') }]"
          />
          <span *ngIf="showErrors && hasError('country')" class="vkecom-address-error">
            {{ getError('country') }}
          </span>
        </label>
      </div>

      <button type="submit" [disabled]="errors().length > 0" class="vkecom-address-submit">
        Continue
      </button>
    </form>
  `,
})
export class AddressFormComponent {
  @Input() initialAddress?: Partial<ShippingAddress>;
  @Output() submit = new EventEmitter<ShippingAddress>();
  @Input() className?: string;
  @Input() showErrors = true;

  address = signal<Partial<ShippingAddress>>(this.initialAddress || {});
  errors = signal<Array<{ field: string; message: string }>>([]);

  ngOnInit(): void {
    if (this.initialAddress) {
      this.address.set(this.initialAddress);
    }
  }

  hasError(field: string): boolean {
    return this.errors().some((e) => e.field === field);
  }

  getError(field: string): string | undefined {
    return this.errors().find((e) => e.field === field)?.message;
  }

  validate(): boolean {
    const newErrors: Array<{ field: string; message: string }> = [];

    if (!this.address().street || this.address().street!.trim().length === 0) {
      newErrors.push({ field: 'street', message: 'Street is required' });
    }

    if (!this.address().city || this.address().city!.trim().length === 0) {
      newErrors.push({ field: 'city', message: 'City is required' });
    }

    if (!this.address().postalCode || this.address().postalCode!.trim().length === 0) {
      newErrors.push({ field: 'postalCode', message: 'Postal code is required' });
    }

    if (!this.address().country || this.address().country!.trim().length === 0) {
      newErrors.push({ field: 'country', message: 'Country is required' });
    }

    if (!this.address().recipientName || this.address().recipientName!.trim().length === 0) {
      newErrors.push({ field: 'recipientName', message: 'Recipient name is required' });
    }

    this.errors.set(newErrors);
    return newErrors.length === 0;
  }

  handleSubmit(): void {
    if (this.validate()) {
      this.submit.emit(this.address() as ShippingAddress);
    }
  }
}

