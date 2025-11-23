import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';

/**
 * CartSummary component - Displays cart summary with totals
 * Fully customizable via CSS classes
 */
@Component({
  selector: 'vk-cart-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-summary.component.html',
})
export class CartSummaryComponent {
  @Input() className?: string;
  @Input() showItemCount = true;
  @Input() showSubtotal = true;
  @Input() showTax = false;
  @Input() taxRate = 0;
  @Input() showShipping = false;
  @Input() shippingCost = 0;
  @Input() showTotal = true;
  @Input() showCheckoutButton = false;
  @Output() checkout = new EventEmitter<void>();

  // Use signals from the service
  total;
  itemCount;

  subtotal;
  tax;
  shipping;
  finalTotal;

  constructor(public cartService: CartService) {
    this.total = this.cartService.total;
    this.itemCount = this.cartService.itemCount;
    this.subtotal = computed(() => this.total());
    this.tax = computed(() => this.subtotal() * this.taxRate);
    this.shipping = computed(() => (this.showShipping ? this.shippingCost : 0));
    this.finalTotal = computed(() => this.subtotal() + this.tax() + this.shipping());
  }

  handleCheckout(): void {
    this.checkout.emit();
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }
}


