import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed, NO_ERRORS_SCHEMA } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { CartViewComponent } from '../components/cart-view.component';
import { CartService } from '../services/cart.service';
import { CartStore } from '@alejandrovrod/blocks-core';
import type { Product } from '@alejandrovrod/blocks-core';
import { loadComponentTemplate } from './test-helpers';

// NOTE: These tests are skipped due to a known issue with Angular 21 and Vitest
// where components with templateUrl cannot be resolved during testing.
// See TESTING_ISSUES.md for more details.
// TODO: Re-enable when Angular/Vitest integration is fixed
describe.skip('CartViewComponent', () => {
  let component: CartViewComponent;
  let fixture: ComponentFixture<CartViewComponent>;
  let cartService: CartService;

  beforeEach(async () => {
    CartStore.resetInstance();
    
    // Load template content
    const template = loadComponentTemplate('cart-view');
    
    // Reset TestBed to ensure clean state
    TestBed.resetTestingModule();
    
    // Configure with NO_ERRORS_SCHEMA to allow unresolved templates temporarily
    TestBed.configureTestingModule({
      imports: [CartViewComponent],
      providers: [CartService],
      schemas: [NO_ERRORS_SCHEMA],
    });
    
    // Override component metadata to replace templateUrl with inline template
    TestBed.overrideComponent(CartViewComponent, {
      set: {
        template: template,
        templateUrl: undefined,
      },
    });
    
    await TestBed.compileComponents();
    
    fixture = TestBed.createComponent(CartViewComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render empty cart message when cart is empty', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Your cart is empty');
  });

  it('should render custom empty message', () => {
    component.emptyMessage = 'No items in cart';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No items in cart');
  });

  it('should render cart items when cart has items', () => {
    const product1: Product = { id: '1', name: 'Product 1', price: 10 };
    const product2: Product = { id: '2', name: 'Product 2', price: 20 };

    cartService.addItem(product1, 2);
    cartService.addItem(product2, 1);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Product 1');
    expect(compiled.textContent).toContain('Product 2');
  });

  it('should render with custom className', () => {
    component.className = 'custom-cart';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const cartView = compiled.querySelector('.vkecom-cart-view');
    expect(cartView?.classList.contains('custom-cart')).toBe(true);
  });

  it('should show header by default', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const header = compiled.querySelector('.vkecom-cart-header');
    expect(header).toBeTruthy();
    expect(compiled.textContent).toContain('Cart');
  });

  it('should hide header when showHeader is false', () => {
    component.showHeader = false;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const header = compiled.querySelector('.vkecom-cart-header');
    expect(header).toBeFalsy();
  });

  it('should have semantic HTML structure', () => {
    const product: Product = { id: '1', name: 'Product 1', price: 10 };
    cartService.addItem(product, 1);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const list = compiled.querySelector('.vkecom-cart-list[role="list"]');
    expect(list).toBeTruthy();
  });
});

