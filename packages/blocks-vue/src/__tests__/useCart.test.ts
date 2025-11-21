import { describe, it, expect, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { defineComponent, computed } from 'vue';
import { useCart } from '../composables/useCart';
import { CartStore } from '@vk/blocks-core';
import type { Product } from '@vk/blocks-core';

describe('useCart', () => {
  beforeEach(() => {
    CartStore.resetInstance();
  });

  it('should initialize with empty cart', async () => {
    const TestComponent = defineComponent({
      setup() {
        const cart = useCart();
        return { cart };
      },
      template: '<div data-testid="items-count">{{ cart.itemCount }}</div>',
    });

    const wrapper = mount(TestComponent);
    await flushPromises();
    
    expect(wrapper.find('[data-testid="items-count"]').text()).toBe('0');
  });

  it('should add item to cart', async () => {
    const TestComponent = defineComponent({
      setup() {
        const cart = useCart();
        const product: Product = {
          id: '1',
          name: 'Test Product',
          price: 10,
        };

        const addProduct = () => {
          cart.addItem(product, 2);
        };

        return { cart, addProduct };
      },
      template: `
        <div>
          <button @click="addProduct">Add</button>
          <div data-testid="count">{{ cart.itemCount }}</div>
          <div data-testid="total">{{ cart.total }}</div>
        </div>
      `,
    });

    const wrapper = mount(TestComponent);
    expect(wrapper.find('[data-testid="count"]').text()).toBe('0');

    await wrapper.find('button').trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-testid="count"]').text()).toBe('2');
    expect(wrapper.find('[data-testid="total"]').text()).toBe('20');
  });

  it('should remove item from cart', async () => {
    const TestComponent = defineComponent({
      setup() {
        const cart = useCart();
        const product: Product = {
          id: '1',
          name: 'Test Product',
          price: 10,
        };

        const addProduct = () => {
          cart.addItem(product, 1);
        };

        const removeProduct = () => {
          if (cart.items.value.length > 0) {
            cart.removeItem(cart.items.value[0].id);
          }
        };

        return { cart, addProduct, removeProduct };
      },
      template: `
        <div>
          <button @click="addProduct">Add</button>
          <button @click="removeProduct">Remove</button>
          <div data-testid="count">{{ cart.itemCount }}</div>
        </div>
      `,
    });

    const wrapper = mount(TestComponent);
    await wrapper.find('button').trigger('click');
    await flushPromises();

    expect(wrapper.find('[data-testid="count"]').text()).toBe('1');

    const removeButton = wrapper.findAll('button')[1];
    await removeButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-testid="count"]').text()).toBe('0');
  });

  it('should update item quantity', async () => {
    const TestComponent = defineComponent({
      setup() {
        const cart = useCart();
        const product: Product = {
          id: '1',
          name: 'Test Product',
          price: 10,
        };

        const addProduct = () => {
          cart.addItem(product, 1);
        };

        const updateQty = () => {
          if (cart.items.value.length > 0) {
            cart.updateQuantity(cart.items.value[0].id, 5);
          }
        };

        return { cart, addProduct, updateQty };
      },
      template: `
        <div>
          <button @click="addProduct">Add</button>
          <button @click="updateQty">Update</button>
          <div data-testid="count">{{ cart.itemCount }}</div>
        </div>
      `,
    });

    const wrapper = mount(TestComponent);
    await wrapper.find('button').trigger('click');
    await flushPromises();

    expect(wrapper.find('[data-testid="count"]').text()).toBe('1');

    const updateButton = wrapper.findAll('button')[1];
    await updateButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-testid="count"]').text()).toBe('5');
  });

  it('should clear cart', async () => {
    const TestComponent = defineComponent({
      setup() {
        const cart = useCart();
        const product: Product = {
          id: '1',
          name: 'Test Product',
          price: 10,
        };

        const addProduct = () => {
          cart.addItem(product, 1);
        };

        const clearCart = () => {
          cart.clear();
        };

        return { cart, addProduct, clearCart };
      },
      template: `
        <div>
          <button @click="addProduct">Add</button>
          <button @click="clearCart">Clear</button>
          <div data-testid="count">{{ cart.itemCount }}</div>
        </div>
      `,
    });

    const wrapper = mount(TestComponent);
    await wrapper.find('button').trigger('click');
    await flushPromises();

    expect(wrapper.find('[data-testid="count"]').text()).toBe('1');

    const clearButton = wrapper.findAll('button')[1];
    await clearButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-testid="count"]').text()).toBe('0');
  });

  it('should compute reactive values', async () => {
    const TestComponent = defineComponent({
      setup() {
        const cart = useCart();
        return { cart };
      },
      template: `
        <div>
          <div data-testid="items">{{ cart.itemCount }}</div>
          <div data-testid="total">{{ cart.total }}</div>
          <div data-testid="count">{{ cart.itemCount }}</div>
        </div>
      `,
    });

    const wrapper = mount(TestComponent);
    await flushPromises();

    expect(wrapper.find('[data-testid="items"]').text()).toBe('0');
    expect(wrapper.find('[data-testid="total"]').text()).toBe('0');
    expect(wrapper.find('[data-testid="count"]').text()).toBe('0');
  });
});

