<template>
  <div class="layout-wrapper">
    <Sidebar />
    <div class="layout-content">
      <Navbar />
      <main class="main-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/dashboard/Navbar.vue'
import Sidebar from '@/components/dashboard/Sidebar.vue'
</script>

<style scoped>
.layout-wrapper {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-background);
}

.layout-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 2rem;
  background-color: var(--color-background-soft);
}
</style>
