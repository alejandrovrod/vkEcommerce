<template>
  <form :class="['vkecom-product-search', className]" @submit.prevent="handleSubmit">
    <slot name="input" :value="localQuery" :on-change="handleChange" :on-submit="handleSubmit">
      <input
        v-model="localQuery"
        type="search"
        :placeholder="placeholder"
        class="vkecom-product-search-input"
      />
    </slot>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useProductSearch } from './useProductSearch';
import type { SearchOptions } from '@vk/blocks-core';

interface Props {
  initialQuery?: string;
  initialOptions?: SearchOptions;
  onSearch?: (query: string, options: SearchOptions) => void;
  className?: string;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search products...',
});

const search = useProductSearch(props.initialOptions);
const localQuery = ref(props.initialQuery || search.query.value);

const handleSubmit = () => {
  search.setQuery(localQuery.value);
  props.onSearch?.(localQuery.value, { ...search.options.value, query: localQuery.value });
};

const handleChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  localQuery.value = target.value;
};
</script>

