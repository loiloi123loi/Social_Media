<template>
  <div class="notfound-container">
    <h1>404 - Page Not Found</h1>
    <p>You will be redirected to the home page in {{ countdown }} seconds.</p>
    <div>
      <Button label="Back to homepage" variant="outline" :onclick="handleBackToHome" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/Button.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const countdown = ref(5)
const router = useRouter()

onMounted(() => {
  const interval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearInterval(interval)
      router.push({ name: 'Home' })
    }
  }, 1000)
})

const handleBackToHome = () => {
  router.push({ name: 'Home' })
}
</script>

<style scoped>
.notfound-container {
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
