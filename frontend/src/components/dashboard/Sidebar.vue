<template>
  <aside class="sidebar">
    <div class="logo">
      <img src="@/assets/images/logo.png" alt="Logo" />
    </div>
    <ul class="menu">
      <li
        v-for="item in items"
        :key="item.label"
        :class="['menu-item', { active: item.to === $route.path }]"
        @click="navigateTo(item.to)"
      >
        <i :class="['menu-icon', item.icon]" />
        <span class="menu-text">{{ item.label }}</span>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const items = [
  { label: 'News Feed', icon: 'pi pi-home', to: '/' },
  { label: 'Friends', icon: 'pi pi-users', to: '/friends' },
  { label: 'Videos', icon: 'pi pi-video', to: '/videos' },
  { label: 'Messages', icon: 'pi pi-comment', to: '/messages' },
  { label: 'Groups', icon: 'pi pi-th-large', to: '/groups' },
  { label: 'Settings', icon: 'pi pi-cog', to: '/settings' },
]

const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  background: var(--color-background-soft);
  border-right: 1px solid var(--color-border);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100vh;
}

.logo {
  text-align: left;
}

.logo img {
  max-width: 64px;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 0.875rem 1.25rem;
  border-radius: 12px;
  cursor: pointer;
  color: var(--text-color);
  transition: all 0.3s ease;
}

.menu-item:hover {
  background: linear-gradient(90deg, var(--primary-color-light), var(--primary-color));
  color: var(--primary-color-text);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.menu-item.active {
  background: linear-gradient(90deg, var(--primary-color-dark), var(--primary-color));
  color: var(--primary-color-text);
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.menu-icon {
  margin-right: 0.75rem;
  font-size: 1.2rem;
}

.menu-text {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .sidebar {
    width: 80px;
    padding: 1rem 0.5rem;
  }

  .menu-text {
    display: none;
  }

  .menu-icon {
    margin-right: 0;
    font-size: 1.4rem;
  }

  .menu-item {
    justify-content: center;
    padding: 0.75rem;
  }
}
</style>
