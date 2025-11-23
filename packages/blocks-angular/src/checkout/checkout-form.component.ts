/**
 * Checkout form component
 */

import { Component, Input, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutService } from './checkout.service';
import type { ShippingAddress, BillingAddress, PaymentMethodDetails } from '@alejandrovrod/blocks-core';

@Component({
  selector: 'vk-checkout-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout-form.component.html',
})
export class CheckoutFormComponent implements OnInit {
  @Input() subtotal!: number;
  @Input() cartId?: string;
  @Input() className?: string;
  @Output() complete = new EventEmitter<string>();
  @Output() error = new EventEmitter<Error>();

  shippingAddress = signal<Partial<ShippingAddress>>({});
  billingAddress = signal<Partial<BillingAddress>>({});
  paymentMethod = signal<Partial<PaymentMethodDetails>>({});
  useSameAddress = signal(true);

  constructor(public checkout: CheckoutService) {
    // Initialize checkout session when subtotal changes
    // Note: In a real implementation, you'd use ngOnChanges or effect
  }

  ngOnInit(): void {
    this.checkout.initializeSession(this.subtotal, this.cartId);
  }

  handleSubmit(): void {
    try {
      const shippingResult = this.checkout.setShippingAddress(
        this.shippingAddress() as ShippingAddress
      );
      if (!shippingResult.valid) {
        this.error.emit(new Error(shippingResult.errors.map((e) => e.message).join(', ')));
        return;
      }

      const billing = this.useSameAddress()
        ? (this.shippingAddress() as BillingAddress)
        : this.billingAddress();
      const billingResult = this.checkout.setBillingAddress(billing as BillingAddress);
      if (!billingResult.valid) {
        this.error.emit(new Error(billingResult.errors.map((e) => e.message).join(', ')));
        return;
      }

      if (this.paymentMethod().method) {
        this.checkout.setPaymentMethod(this.paymentMethod() as PaymentMethodDetails);
      }

      const validation = this.checkout.validateCheckout();
      if (!validation.valid) {
        this.error.emit(new Error(validation.errors.map((e) => e.message).join(', ')));
        return;
      }

      this.checkout.createPayment().then(() => {
        this.complete.emit(this.checkout.session()?.id || '');
      });
    } catch (err) {
      this.error.emit(err instanceof Error ? err : new Error(String(err)));
    }
  }
}


