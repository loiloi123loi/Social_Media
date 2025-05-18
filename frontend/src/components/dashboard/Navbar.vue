<template>
  <nav class="navbar">
    <div class="search-box">
      <InputField model-value="" placeholder="Search..." prefix-icon="pi-search" />
    </div>
    <div class="nav-actions">
      <ThemeToggler />
      <div class="notification-icon" @click="toggleNotifications">
        <i class="pi pi-bell" />
        <span v-if="hasNotifications" class="notification-badge" />
      </div>
      <div class="user-profile" ref="userProfileRef" @click="toggleDropdown">
        <img src="@/assets/images/avatar.png" alt="User Avatar" class="avatar" />
        <span class="user-name">{{ user.name }}</span>
        <div v-if="isDropdownOpen" class="dropdown-menu">
          <ul>
            <li @click="goToProfile">Profile</li>
            <li @click="goToSettings">Settings</li>
            <li @click="handleClickLogout">Logout</li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import InputField from '@/components/InputField.vue'
import ThemeToggler from '@/components/ThemeToggler.vue'
import { useAuthStore } from '@/stores/auth'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { logout } = useAuthStore()
const isDropdownOpen = ref(false)
const hasNotifications = ref(true)
const userProfileRef = ref<HTMLElement | null>(null)

defineProps({
  user: {
    type: Object,
    default: () => ({
      name: 'John Doe123',
      role: 'User',
      avatar: '@/assets/images/avatar.png',
    }),
  },
})

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const toggleNotifications = () => {
  alert('Notifications clicked!')
}

const goToProfile = () => {
  isDropdownOpen.value = false
  router.push('/profile')
}

const goToSettings = () => {
  isDropdownOpen.value = false
  router.push('/settings')
}

const handleClickLogout = () => {
  isDropdownOpen.value = false
  logout()
}

const handleClickOutside = (event: MouseEvent) => {
  if (userProfileRef.value && !userProfileRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.navbar {
  padding: 1rem 1rem;
  background: var(--color-background-soft);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.p-input-icon-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-box {
  width: 300px;
}

.user-profile {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.user-profile:hover {
  background-color: var(--color-background);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-weight: bold;
  color: var(--color-heading);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.notification-icon {
  position: relative;
  cursor: pointer;
  color: var(--color-text);
}

.notification-icon:hover {
  color: var(--color-primary);
}

.notification-badge {
  position: absolute;
  top: 0;
  right: -4px;
  width: 10px;
  height: 10px;
  background-color: var(--color-danger);
  border-radius: 50%;
  border: 2px solid var(--color-background-soft);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 150px;
  z-index: 10;
}

.dropdown-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdown-menu li {
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.dropdown-menu li:hover {
  background-color: var(--color-primary);
  color: var(--color-button-text);
}

:deep(.p-inputtext) {
  width: 100%;
  background: var(--color-background);
}

:deep(.p-button.p-button-icon-only) {
  width: 2.5rem;
  height: 2.5rem;
}
</style>
