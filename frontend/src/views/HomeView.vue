<template>
  <div class="home-container">
    <h1>Welcome to the Home Page</h1>
    <p>You are logged in!</p>
    <div>
      <Button label="Logout" type="button" variant="danger" @click="handleLogout" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/Button.vue'

const handleLogout = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  window.location.href = '/login'
}
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  background-color: var(--color-background);
}

h1 {
  font-size: 2rem;
  color: var(--color-heading);
  margin-bottom: 1rem;
}

p {
  font-size: 1rem;
  color: var(--color-text);
  margin-bottom: 2rem;
}
</style>
