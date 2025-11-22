<template>
  <div :class="['vkecom-cart-history', className]">
    <div v-if="history.entries.length === 0" :class="['vkecom-cart-history-empty']">
      <slot name="empty">
        <p>{{ emptyMessage }}</p>
      </slot>
    </div>
    <template v-else>
      <h3 class="vkecom-cart-history-title">Cart History</h3>
      <ul class="vkecom-cart-history-list" role="list">
        <li
          v-for="entry in history.entries"
          :key="entry.id"
          class="vkecom-cart-history-entry"
          role="listitem"
        >
          <slot name="entry" :entry="entry" :on-restore="() => handleRestore(entry)" :on-remove="() => history.removeEntry(entry.id)">
            <div class="vkecom-cart-history-entry-content">
              <div class="vkecom-cart-history-entry-info">
                <div v-if="entry.label" class="vkecom-cart-history-entry-label">
                  {{ entry.label }}
                </div>
                <div class="vkecom-cart-history-entry-date">
                  {{ new Date(entry.timestamp).toLocaleString() }}
                </div>
                <div class="vkecom-cart-history-entry-items">
                  {{ entry.state.itemCount }} items - ${{ entry.state.total.toFixed(2) }}
                </div>
              </div>
              <div class="vkecom-cart-history-entry-actions">
                <button
                  type="button"
                  @click="handleRestore(entry)"
                  class="vkecom-cart-history-entry-restore"
                >
                  Restore
                </button>
                <button
                  type="button"
                  @click="history.removeEntry(entry.id)"
                  class="vkecom-cart-history-entry-remove"
                >
                  Remove
                </button>
              </div>
            </div>
          </slot>
        </li>
      </ul>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useCartHistory } from '../composables/useCartHistory';
import type { CartHistoryEntry, CartHistoryOptions } from '@vk/blocks-core';

interface Props {
  className?: string;
  historyOptions?: CartHistoryOptions;
  onRestore?: (entry: CartHistoryEntry) => void;
  emptyMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  emptyMessage: 'No cart history',
});

const history = useCartHistory(props.historyOptions);

const handleRestore = (entry: CartHistoryEntry) => {
  const restored = history.restoreState(entry.id);
  if (restored && props.onRestore) {
    props.onRestore(entry);
  }
};
</script>

