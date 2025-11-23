<template>
  <div :class="['vkecom-product-filters', className]">
    <slot name="filters" :filters="filters" :facets="facets" :on-change="onChange">
      <div class="vkecom-product-filters-section">
        <h3>Price Range</h3>
        <input
          type="number"
          placeholder="Min"
          :value="filters.priceRange?.min || ''"
          @input="handlePriceMinChange"
          class="vkecom-product-filters-input"
        />
        <input
          type="number"
          placeholder="Max"
          :value="filters.priceRange?.max || ''"
          @input="handlePriceMaxChange"
          class="vkecom-product-filters-input"
        />
      </div>

      <div v-if="facets?.categories && facets.categories.length > 0" class="vkecom-product-filters-section">
        <h3>Categories</h3>
        <label
          v-for="category in facets.categories"
          :key="category.id"
          class="vkecom-product-filters-checkbox"
        >
          <input
            type="checkbox"
            :checked="filters.categories?.includes(category.id) || false"
            @change="handleCategoryToggle(category.id)"
          />
          <span>{{ category.name }} ({{ category.count }})</span>
        </label>
      </div>

      <div v-if="facets?.tags && facets.tags.length > 0" class="vkecom-product-filters-section">
        <h3>Tags</h3>
        <label
          v-for="tagItem in facets.tags"
          :key="tagItem.tag"
          class="vkecom-product-filters-checkbox"
        >
          <input
            type="checkbox"
            :checked="filters.tags?.includes(tagItem.tag) || false"
            @change="handleTagToggle(tagItem.tag)"
          />
          <span>{{ tagItem.tag }} ({{ tagItem.count }})</span>
        </label>
      </div>

      <div class="vkecom-product-filters-section">
        <label class="vkecom-product-filters-checkbox">
          <input
            type="checkbox"
            :checked="filters.inStock === true"
            @change="handleStockToggle"
          />
          <span>In Stock Only</span>
        </label>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ProductFilter } from '@alejandrovrod/blocks-core';

interface Props {
  filters: ProductFilter;
  facets?: {
    categories?: Array<{ id: string; name: string; count: number }>;
    priceRanges?: Array<{ min: number; max: number; count: number }>;
    tags?: Array<{ tag: string; count: number }>;
  };
  onChange: (filters: ProductFilter) => void;
  className?: string;
}

const props = defineProps<Props>();

const handlePriceMinChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  props.onChange({
    ...props.filters,
    priceRange: {
      min: target.value ? parseFloat(target.value) : undefined,
      max: props.filters.priceRange?.max,
    },
  });
};

const handlePriceMaxChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  props.onChange({
    ...props.filters,
    priceRange: {
      min: props.filters.priceRange?.min,
      max: target.value ? parseFloat(target.value) : undefined,
    },
  });
};

const handleCategoryToggle = (categoryId: string) => {
  const currentCategories = props.filters.categories || [];
  const newCategories = currentCategories.includes(categoryId)
    ? currentCategories.filter((id) => id !== categoryId)
    : [...currentCategories, categoryId];
  
  props.onChange({
    ...props.filters,
    categories: newCategories.length > 0 ? newCategories : undefined,
  });
};

const handleTagToggle = (tag: string) => {
  const currentTags = props.filters.tags || [];
  const newTags = currentTags.includes(tag)
    ? currentTags.filter((t) => t !== tag)
    : [...currentTags, tag];
  
  props.onChange({
    ...props.filters,
    tags: newTags.length > 0 ? newTags : undefined,
  });
};

const handleStockToggle = () => {
  props.onChange({
    ...props.filters,
    inStock: props.filters.inStock === true ? undefined : true,
  });
};
</script>


