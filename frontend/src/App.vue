<template>
  <Toast position="top-right" group="tr" />
  <Toast position="bottom-right" group="br" />
  <RouterView />
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
import Toast from 'primevue/toast'

const themeStore = useThemeStore()
themeStore.initTheme()
</script>

<style scoped></style>
