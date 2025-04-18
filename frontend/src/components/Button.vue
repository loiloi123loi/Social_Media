<template>
  <button :type="type" :class="['btn', variant]" v-bind="$attrs" @click="onClick">
    <span v-if="prefixIcon" class="icon prefix-icon">
      <i :class="`pi ${prefixIcon}`" />
    </span>
    {{ label }}
    <span v-if="suffixIcon" class="icon suffix-icon">
      <i :class="`pi ${suffixIcon}`" />
    </span>
  </button>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  type: {
    type: String as () => 'button' | 'submit' | 'reset' | undefined,
    default: 'button',
  },
  label: {
    type: String,
    required: true,
  },
  variant: {
    type: String as () => 'primary' | 'danger' | 'warning' | 'outline',
    default: 'primary',
  },
  onClick: {
    type: Function as PropType<() => void>,
    default: () => {},
  },
  prefixIcon: {
    type: String,
    default: null,
  },
  suffixIcon: {
    type: String,
    default: null,
  },
})
</script>

<style scoped>
.btn {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary {
  background-color: var(--color-primary);
  color: var(--color-button-text);
}

.primary:hover {
  background-color: var(--color-primary-hover);
}

.danger {
  background-color: var(--color-danger);
  color: var(--color-button-text);
}

.danger:hover {
  background-color: var(--color-danger-hover);
}

.warning {
  background-color: var(--color-warning);
  color: var(--color-warning-text);
}

.warning:hover {
  background-color: var(--color-warning-hover);
}

.outline {
  background-color: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.outline:hover {
  border-color: var(--color-border-hover);
  background-color: var(--color-background-soft);
}
</style>
