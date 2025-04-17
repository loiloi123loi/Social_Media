<template>
  <div class="login-container">
    <div class="form-wrapper">
      <h1>Welcome Back!</h1>
      <p class="subtitle">Login to access your account</p>
      <form @submit.prevent="handleLogin" novalidate>
        <InputField
          label="Email"
          v-model="form.email"
          type="email"
          placeholder="Enter your email"
          required
          :error-message="errors.email"
          @blur="validateField('email')"
          @validate="validateField('email')"
        />
        <InputField
          label="Password"
          v-model="form.password"
          placeholder="Enter your password"
          :type="showPassword ? 'text' : 'password'"
          :suffix-icon="`${showPassword ? 'pi-eye' : 'pi-eye-slash'}`"
          @suffix-click="() => (showPassword = !showPassword)"
          required
          :error-message="errors.password"
          @blur="validateField('password')"
          @validate="validateField('password')"
        />
        <Button label="Login" type="submit" />
      </form>
      <p class="switch-message">
        New here? <RouterLink to="/register" class="switch-link">Create an account</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ILoginRequestData } from '@/api/auth'
import Button from '@/components/Button.vue'
import InputField from '@/components/InputField.vue'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface IFormErrors {
  email?: string
  password?: string
}

const router = useRouter()
const form = ref<ILoginRequestData>({ email: '', password: '' })
const errors = ref<IFormErrors>({})
const showPassword = ref(false)
const { login } = useAuthStore()

const validateField = (field: keyof ILoginRequestData) => {
  errors.value[field] = ''

  switch (field) {
    case 'email':
      if (!form.value.email) {
        errors.value.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
        errors.value.email = 'Invalid email format'
      }
      break
    case 'password':
      if (!form.value.password) {
        errors.value.password = 'Password is required'
      }
      break
  }
}

const handleLogin = async () => {
  await login(form.value)
  router.push({ name: 'Home' })
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--color-background);
}

.form-wrapper {
  background: var(--color-background-soft);
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

h1 {
  margin-bottom: 1rem;
  color: var(--color-heading);
}

.subtitle {
  margin-bottom: 2rem;
  color: var(--color-text);
  font-size: 1rem;
}

.switch-message {
  margin-top: 1.5rem;
  color: var(--color-text);
}

.switch-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s;
}

.switch-link:hover {
  color: var(--color-primary-hover);
}
</style>
