/**
 * Address form component
 */

import { Component, Input, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { ShippingAddress } from '@alejandrovrod/blocks-core';

@Component({
  selector: 'vk-address-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './address-form.component.html',
})
export class AddressFormComponent implements OnInit {
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


