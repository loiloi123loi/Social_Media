<template>
  <button @click="themeStore.toggleTheme" class="theme-toggle">
    <i :class="['pi', themeStore.isDark ? 'pi-sun' : 'pi-moon']"></i>
  </button>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
</script>

<style scoped>
.theme-toggle {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: var(--color-text);
}

.theme-toggle:hover {
  color: var(--color-primary);
}
</style>
