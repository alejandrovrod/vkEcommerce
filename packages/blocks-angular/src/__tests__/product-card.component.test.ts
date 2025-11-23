import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed, NO_ERRORS_SCHEMA } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { ProductCardComponent } from '../products/product-card.component';
import { CartService } from '../services/cart.service';
import { CartStore } from '@alejandrovrod/blocks-core';
import type { Product } from '@alejandrovrod/blocks-core';

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  price: 29.99,
  image: 'https://example.com/image.jpg',
  description: 'Test description',
};

// NOTE: These tests are skipped due to a known issue with Angular 21 and Vitest
// where components with templateUrl cannot be resolved during testing.
// See TESTING_ISSUES.md for more details.
// TODO: Re-enable when Angular/Vitest integration is fixed
describe.skip('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let cartService: CartService;

  beforeEach(async () => {
    CartStore.resetInstance();
    
    // Load template content - product-card is in products folder
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const templatePath = resolve(__dirname, '../products/product-card.component.html');
    const template = readFileSync(templatePath, 'utf-8');
    
    // Reset TestBed to ensure clean state
    TestBed.resetTestingModule();
    
    // Configure with NO_ERRORS_SCHEMA to allow unresolved templates temporarily
    TestBed.configureTestingModule({
      imports: [BrowserModule, ProductCardComponent],
      providers: [CartService],
      schemas: [NO_ERRORS_SCHEMA],
    });
    
    // Override component metadata to replace templateUrl with inline template
    TestBed.overrideComponent(ProductCardComponent, {
      set: {
        template: template,
        templateUrl: undefined,
      },
    });
    
    await TestBed.compileComponents();
    
    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    component.product = mockProduct;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render product information', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Product');
    expect(compiled.textContent).toContain('$29.99');
    expect(compiled.textContent).toContain('Test description');
    expect(compiled.querySelector('img')?.getAttribute('alt')).toBe('Test Product');
  });

  it('should render with custom className', () => {
    component.className = 'custom-class';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const card = compiled.querySelector('.vkecom-product-card');
    expect(card?.classList.contains('custom-class')).toBe(true);
  });

  it('should render placeholder when no image', () => {
    const productWithoutImage: Product = {
      id: '2',
      name: 'No Image Product',
      price: 10,
    };
    component.product = productWithoutImage;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No image');
    expect(compiled.querySelector('img')).toBeNull();
  });

  it('should have semantic HTML structure', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const article = compiled.querySelector('article[itemscope]');
    expect(article).toBeTruthy();
    expect(article?.getAttribute('itemtype')).toBe('https://schema.org/Product');
  });

  it('should have accessible button with aria-label', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.vkecom-product-button') as HTMLButtonElement;
    expect(button?.getAttribute('aria-label')).toBe('Add Test Product to cart');
  });

  it('should emit addToCart event when button is clicked', () => {
    vi.spyOn(component.addToCart, 'emit');
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.vkecom-product-button') as HTMLButtonElement;

    button?.click();
    fixture.detectChanges();

    expect(component.addToCart.emit).toHaveBeenCalledWith(mockProduct);
  });

  it('should add product to cart when button is clicked', () => {
    vi.spyOn(cartService, 'addItem');
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.vkecom-product-button') as HTMLButtonElement;

    button?.click();
    fixture.detectChanges();

    expect(cartService.addItem).toHaveBeenCalledWith(mockProduct, 1);
  });

  it('should use custom quantity when adding to cart', () => {
    component.quantity = 3;
    vi.spyOn(cartService, 'addItem');
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.vkecom-product-button') as HTMLButtonElement;

    button?.click();
    fixture.detectChanges();

    expect(cartService.addItem).toHaveBeenCalledWith(mockProduct, 3);
  });

  it('should render custom content when useCustomContent is true', () => {
    component.useCustomContent = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const article = compiled.querySelector('article');
    expect(article).toBeNull();
    const customDiv = compiled.querySelector('.vkecom-product-card');
    expect(customDiv).toBeTruthy();
  });

  it('should format price correctly', () => {
    component.product = { ...mockProduct, price: 19.999 };
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('$20.00');
  });
});


