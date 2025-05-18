<template>
  <div class="layout-wrapper">
    <Sidebar class="fixed-sidebar" />
    <div class="layout-content">
      <Navbar class="fixed-navbar" />
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

.fixed-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
}

.layout-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 280px;
}

.fixed-navbar {
  position: fixed;
  top: 0;
  right: 0;
  left: 280px;
  z-index: 99;
}

.main-content {
  flex: 1;
  padding: 1rem;
  background-color: var(--color-background-soft);
  margin-top: 72px;
}

@media (max-width: 768px) {
  .layout-content {
    margin-left: 80px;
  }

  .fixed-navbar {
    left: 80px;
  }
}
</style>
