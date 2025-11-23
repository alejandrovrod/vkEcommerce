/**
 * Tests for ShippingService
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ShippingService } from '../shipping/shipping.service';
import type { ShippingAddress } from '@alejandrovrod/blocks-core';

const mockAddress: ShippingAddress = {
  street: 'Av. Corrientes 123',
  city: 'Buenos Aires',
  postalCode: 'C1043',
  country: 'AR',
  recipientName: 'Juan Pérez',
};

describe('ShippingService', () => {
  let service: ShippingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShippingService],
    });
    service = TestBed.inject(ShippingService);
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize shipping', () => {
    expect(service.address()).toBeNull();
    expect(service.selectedOption()).toBeNull();
  });

  it('should set shipping address', () => {
    service.setShippingAddress(mockAddress);
    
    expect(service.address()).toEqual(mockAddress);
  });

  it('should get available shipping options', () => {
    const options = service.getAvailableOptions();
    expect(Array.isArray(options)).toBe(true);
  });

  it('should select shipping option', () => {
    const options = service.getAvailableOptions();
    if (options.length > 0) {
      service.selectShippingOption(options[0].id);
      expect(service.selectedOption()?.id).toBe(options[0].id);
    }
  });

  it('should calculate shipping rates', async () => {
    service.setShippingAddress(mockAddress);
    
    const rates = await service.calculateRates({
      address: mockAddress,
      items: [
        {
          weight: 1,
          quantity: 2,
          value: 100,
        },
      ],
    });
    
    expect(rates.rates).toBeDefined();
    expect(Array.isArray(rates.rates)).toBe(true);
  });
});


