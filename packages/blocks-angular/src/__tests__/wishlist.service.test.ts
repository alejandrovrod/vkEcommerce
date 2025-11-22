/**
 * Tests for WishlistService
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { WishlistService } from '../wishlist/wishlist.service';
import type { Product } from '@vk/blocks-core';

const mockProduct: Product = {
  id: 'prod-1',
  name: 'Test Product',
  price: 100,
  description: 'Test description',
  image: 'https://example.com/image.jpg',
};

describe('WishlistService', () => {
  let service: WishlistService;

  beforeEach(() => {
    // Reset WishlistStore singleton
    const { WishlistStore } = require('@vk/blocks-core');
    if (WishlistStore.resetInstance) {
      WishlistStore.resetInstance();
    }
    
    TestBed.configureTestingModule({
      providers: [WishlistService],
    });
    service = TestBed.inject(WishlistService);
    service.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty wishlist', () => {
    expect(service.items().length).toBe(0);
    expect(service.itemCount()).toBe(0);
  });

  it('should add product to wishlist', () => {
    service.addItem(mockProduct);
    
    expect(service.items().length).toBe(1);
    expect(service.itemCount()).toBe(1);
    expect(service.items()[0].product).toEqual(mockProduct);
  });

  it('should not add duplicate products', () => {
    service.addItem(mockProduct);
    service.addItem(mockProduct);
    
    expect(service.items().length).toBe(1);
  });

  it('should remove item from wishlist', () => {
    service.addItem(mockProduct);
    const itemId = service.items()[0].id;
    service.removeItem(itemId);
    
    expect(service.items().length).toBe(0);
    expect(service.itemCount()).toBe(0);
  });

  it('should check if product is in wishlist', () => {
    expect(service.hasProduct('prod-1')).toBe(false);
    service.addItem(mockProduct);
    expect(service.hasProduct('prod-1')).toBe(true);
  });

  it('should clear wishlist', () => {
    service.addItem(mockProduct);
    service.clear();
    
    expect(service.items().length).toBe(0);
    expect(service.itemCount()).toBe(0);
  });
});

