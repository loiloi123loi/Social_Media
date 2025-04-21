<template>
  <div class="callback-container">
    <div class="loading-box">
      <i class="pi pi-spinner pi-spin loading-icon"></i>
      <h2>Completing Authentication</h2>
      <p>Please wait while we finalize your login...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const authStore = useAuthStore()

onMounted(async () => {
  try {
    // Get tokens from query parameters
    const accessToken = route.query.accessToken as string
    const refreshToken = route.query.refreshToken as string

    if (!accessToken || !refreshToken) {
      throw new Error('Authentication failed. Missing tokens.')
    }

    // Save tokens to localStorage and update auth state
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)

    // Update authenticated state
    authStore.isAuthenticated = true

    // Show success message
    toast.add({
      severity: 'success',
      summary: 'Login Successful',
      detail: 'You have been logged in with Google',
      life: 3000,
      group: 'tr',
    })

    // Redirect to home page
    setTimeout(() => {
      router.push({ name: 'Home' })
    }, 1000)
  } catch (error) {
    console.error('Authentication callback error:', error)

    // Show error message
    toast.add({
      severity: 'error',
      summary: 'Login Failed',
      detail: error instanceof Error ? error.message : 'Authentication failed',
      life: 5000,
      group: 'tr',
    })

    // Redirect to login page
    setTimeout(() => {
      router.push({ name: 'Login' })
    }, 2000)
  }
})
</script>

<style scoped>
.callback-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--color-background);
}

.loading-box {
  background: var(--color-background-soft);
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
}

.loading-icon {
  font-size: 3rem;
  color: var(--color-primary);
  margin-bottom: 1.5rem;
}

h2 {
  margin-bottom: 1rem;
  color: var(--color-heading);
}

p {
  color: var(--color-text);
}
</style>
