/**
 * Mercado Pago payment button component
 */

import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutService } from './checkout.service';

@Component({
  selector: 'vk-mercadopago-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mercado-pago-button.component.html',
})
export class MercadoPagoButtonComponent implements OnInit, OnDestroy {
  @Input() publicKey!: string;
  @Input() preferenceId?: string;
  @Input() className?: string;
  @Input() label = 'Pay with Mercado Pago';
  @Output() success = new EventEmitter<string>();
  @Output() error = new EventEmitter<Error>();

  @ViewChild('buttonRef') buttonRef?: ElementRef<HTMLButtonElement>;

  mercadoPagoLoaded = false;

  constructor(public checkout: CheckoutService) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && (window as any).MercadoPago) {
      this.mercadoPagoLoaded = true;
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    script.onload = () => {
      this.mercadoPagoLoaded = true;
    };
    script.onerror = () => {
      this.error.emit(new Error('Failed to load Mercado Pago SDK'));
    };
    document.body.appendChild(script);
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  async handleClick(): Promise<void> {
    try {
      if (!this.preferenceId) {
        const payment = await this.checkout.createPayment();
        if (payment.initPoint) {
          window.location.href = payment.initPoint;
        } else {
          this.error.emit(new Error('No payment URL available'));
        }
      } else {
        if ((window as any).MercadoPago) {
          const mp = new (window as any).MercadoPago(this.publicKey);
          mp.checkout({
            preference: {
              id: this.preferenceId,
            },
            render: {
              container: this.buttonRef?.nativeElement.parentElement || '.vkecom-mercadopago-button',
              label: this.label,
            },
          });
        }
      }
    } catch (error) {
      this.error.emit(error instanceof Error ? error : new Error(String(error)));
    }
  }
}


