/**
 * Address form component
 */

import React, { useState, FormEvent } from 'react';
import type { ShippingAddress } from '@vk/blocks-core';

export interface AddressFormProps {
  /**
   * Initial address
   */
  initialAddress?: Partial<ShippingAddress>;
  
  /**
   * On submit callback
   */
  onSubmit: (address: ShippingAddress) => void;
  
  /**
   * Custom class name
   */
  className?: string;
  
  /**
   * Show validation errors
   */
  showErrors?: boolean;
  
  /**
   * Custom render for form fields
   */
  renderFields?: (props: {
    address: Partial<ShippingAddress>;
    onChange: (address: Partial<ShippingAddress>) => void;
    errors: Array<{ field: string; message: string }>;
  }) => React.ReactNode;
  
  /**
   * Custom render for submit button
   */
  renderSubmit?: (props: { onSubmit: () => void; disabled: boolean }) => React.ReactNode;
  
  /**
   * Children (for custom content)
   */
  children?: React.ReactNode;
}

export function AddressForm({
  initialAddress,
  onSubmit,
  className,
  showErrors = true,
  renderFields,
  renderSubmit,
  children,
}: AddressFormProps) {
  const [address, setAddress] = useState<Partial<ShippingAddress>>(initialAddress || {});
  const [errors, setErrors] = useState<Array<{ field: string; message: string }>>([]);

  const validate = (): boolean => {
    const newErrors: Array<{ field: string; message: string }> = [];

    if (!address.street || address.street.trim().length === 0) {
      newErrors.push({ field: 'street', message: 'Street is required' });
    }

    if (!address.city || address.city.trim().length === 0) {
      newErrors.push({ field: 'city', message: 'City is required' });
    }

    if (!address.postalCode || address.postalCode.trim().length === 0) {
      newErrors.push({ field: 'postalCode', message: 'Postal code is required' });
    }

    if (!address.country || address.country.trim().length === 0) {
      newErrors.push({ field: 'country', message: 'Country is required' });
    }

    if (!address.recipientName || address.recipientName.trim().length === 0) {
      newErrors.push({ field: 'recipientName', message: 'Recipient name is required' });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validate()) {
      onSubmit(address as ShippingAddress);
    }
  };

  const handleChange = (field: keyof ShippingAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    setErrors((prev) => prev.filter((err) => err.field !== field));
  };

  if (children) {
    return <div className={`vkecom-address-form ${className || ''}`}>{children}</div>;
  }

  return (
    <form className={`vkecom-address-form ${className || ''}`} onSubmit={handleSubmit}>
      {renderFields ? (
        renderFields({
          address,
          onChange: (newAddress) => setAddress(newAddress),
          errors,
        })
      ) : (
        <>
          <div className="vkecom-address-field">
            <label>
              Recipient Name *
              <input
                type="text"
                value={address.recipientName || ''}
                onChange={(e) => handleChange('recipientName', e.target.value)}
                className={`vkecom-address-input ${errors.some((e) => e.field === 'recipientName') ? 'error' : ''}`}
              />
              {showErrors && errors.find((e) => e.field === 'recipientName') && (
                <span className="vkecom-address-error">
                  {errors.find((e) => e.field === 'recipientName')?.message}
                </span>
              )}
            </label>
          </div>

          <div className="vkecom-address-field">
            <label>
              Street *
              <input
                type="text"
                value={address.street || ''}
                onChange={(e) => handleChange('street', e.target.value)}
                className={`vkecom-address-input ${errors.some((e) => e.field === 'street') ? 'error' : ''}`}
              />
              {showErrors && errors.find((e) => e.field === 'street') && (
                <span className="vkecom-address-error">
                  {errors.find((e) => e.field === 'street')?.message}
                </span>
              )}
            </label>
          </div>

          <div className="vkecom-address-field">
            <label>
              City *
              <input
                type="text"
                value={address.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
                className={`vkecom-address-input ${errors.some((e) => e.field === 'city') ? 'error' : ''}`}
              />
              {showErrors && errors.find((e) => e.field === 'city') && (
                <span className="vkecom-address-error">
                  {errors.find((e) => e.field === 'city')?.message}
                </span>
              )}
            </label>
          </div>

          <div className="vkecom-address-field">
            <label>
              Postal Code *
              <input
                type="text"
                value={address.postalCode || ''}
                onChange={(e) => handleChange('postalCode', e.target.value)}
                className={`vkecom-address-input ${errors.some((e) => e.field === 'postalCode') ? 'error' : ''}`}
              />
              {showErrors && errors.find((e) => e.field === 'postalCode') && (
                <span className="vkecom-address-error">
                  {errors.find((e) => e.field === 'postalCode')?.message}
                </span>
              )}
            </label>
          </div>

          <div className="vkecom-address-field">
            <label>
              Country *
              <input
                type="text"
                value={address.country || ''}
                onChange={(e) => handleChange('country', e.target.value)}
                className={`vkecom-address-input ${errors.some((e) => e.field === 'country') ? 'error' : ''}`}
              />
              {showErrors && errors.find((e) => e.field === 'country') && (
                <span className="vkecom-address-error">
                  {errors.find((e) => e.field === 'country')?.message}
                </span>
              )}
            </label>
          </div>

          {address.phone && (
            <div className="vkecom-address-field">
              <label>
                Phone
                <input
                  type="tel"
                  value={address.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="vkecom-address-input"
                />
              </label>
            </div>
          )}
        </>
      )}

      {renderSubmit ? (
        renderSubmit({
          onSubmit: () => handleSubmit({ preventDefault: () => {} } as FormEvent),
          disabled: errors.length > 0,
        })
      ) : (
        <button type="submit" className="vkecom-address-submit">
          Continue
        </button>
      )}
    </form>
  );
}

