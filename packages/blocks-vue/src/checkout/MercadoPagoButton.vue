<template>
  <div :class="['vkecom-mercadopago-button', className]">
    <button
      ref="buttonRef"
      type="button"
      :disabled="checkout.loading || (!preferenceId && !checkout.session)"
      @click="handleClick"
    >
      {{ checkout.loading ? 'Loading...' : label }}
    </button>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useCheckout } from './useCheckout';

interface Props {
  publicKey: string;
  preferenceId?: string;
  className?: string;
  label?: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: Error) => void;
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Pay with Mercado Pago',
});

const checkout = useCheckout();
const buttonRef = ref<HTMLButtonElement | null>(null);
const mercadoPagoLoaded = ref(false);

onMounted(() => {
  if (mercadoPagoLoaded.value || typeof window === 'undefined') {
    return;
  }

  if ((window as any).MercadoPago) {
    mercadoPagoLoaded.value = true;
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://sdk.mercadopago.com/js/v2';
  script.async = true;
  script.onload = () => {
    mercadoPagoLoaded.value = true;
  };
  script.onerror = () => {
    props.onError?.(new Error('Failed to load Mercado Pago SDK'));
  };
  document.body.appendChild(script);
});

const handleClick = async () => {
  try {
    if (!props.preferenceId) {
      const payment = await checkout.createPayment();
      if (payment.initPoint) {
        window.location.href = payment.initPoint;
      } else {
        props.onError?.(new Error('No payment URL available'));
      }
    } else {
      if ((window as any).MercadoPago) {
        const mp = new (window as any).MercadoPago(props.publicKey);
        mp.checkout({
          preference: {
            id: props.preferenceId,
          },
          render: {
            container: buttonRef.value?.parentElement || '.vkecom-mercadopago-button',
            label: props.label,
          },
        });
      }
    }
  } catch (error) {
    props.onError?.(error instanceof Error ? error : new Error(String(error)));
  }
};
</script>

