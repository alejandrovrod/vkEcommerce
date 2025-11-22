import { Component, Input, Output, EventEmitter, ContentChildren, QueryList, ElementRef, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import type { Product } from '@vk/blocks-core';

/**
 * ProductCard component - Displays a product card with add to cart functionality
 * Fully customizable via CSS classes
 * 
 * Usage examples:
 * 
 * Basic usage:
 * <vk-product-card [product]="product"></vk-product-card>
 * 
 * Custom slots (use attributes to target specific slots):
 * <vk-product-card [product]="product">
 *   <div image>Custom image content</div>
 *   <h2 title>Custom title</h2>
 *   <span price>Custom price</span>
 *   <button button (click)="handleAdd()">Custom button</button>
 * </vk-product-card>
 * 
 * Fully custom content:
 * <vk-product-card [product]="product" [useCustomContent]="true">
 *   <div>Your completely custom content</div>
 * </vk-product-card>
 */
@Component({
  selector: 'vk-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent implements AfterContentInit {
  @Input() product!: Product;
  @Input() className?: string;
  @Input() quantity: number = 1;
  @Input() useCustomContent: boolean = false;
  @Output() addToCart = new EventEmitter<Product>();

  @ContentChildren('[image]', { read: ElementRef }) imageSlots!: QueryList<ElementRef>;
  @ContentChildren('[title]', { read: ElementRef }) titleSlots!: QueryList<ElementRef>;
  @ContentChildren('[price]', { read: ElementRef }) priceSlots!: QueryList<ElementRef>;
  @ContentChildren('[button]', { read: ElementRef }) buttonSlots!: QueryList<ElementRef>;

  hasImageSlot = false;
  hasTitleSlot = false;
  hasPriceSlot = false;
  hasButtonSlot = false;

  constructor(private cartService: CartService) {}

  ngAfterContentInit(): void {
    this.hasImageSlot = this.imageSlots.length > 0;
    this.hasTitleSlot = this.titleSlots.length > 0;
    this.hasPriceSlot = this.priceSlots.length > 0;
    this.hasButtonSlot = this.buttonSlots.length > 0;
  }

  onAddToCart(): void {
    this.cartService.addItem(this.product, this.quantity);
    this.addToCart.emit(this.product);
  }

  formatPrice(price: number): string {
    return price.toFixed(2);
  }
}

