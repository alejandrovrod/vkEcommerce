/**
 * Payment method selector component
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { PaymentMethodDetails, PaymentMethod } from '@vk/blocks-core';

@Component({
  selector: 'vk-payment-method-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-method-selector.component.html',
})
export class PaymentMethodSelectorComponent {
  @Input() value?: PaymentMethodDetails;
  @Input() methods: PaymentMethod[] = [
    'credit_card',
    'debit_card',
    'bank_transfer',
    'cash',
    'digital_wallet',
    'mercado_pago',
  ];
  @Output() change = new EventEmitter<PaymentMethodDetails>();
  @Input() className?: string;

  private readonly METHOD_LABELS: Record<PaymentMethod, string> = {
    credit_card: 'Credit Card',
    debit_card: 'Debit Card',
    bank_transfer: 'Bank Transfer',
    cash: 'Cash',
    digital_wallet: 'Digital Wallet',
    mercado_pago: 'Mercado Pago',
  };

  getMethodLabel(method: PaymentMethod): string {
    return this.METHOD_LABELS[method] || method;
  }

  handleSelect(method: PaymentMethod): void {
    this.change.emit({ method });
  }
}

