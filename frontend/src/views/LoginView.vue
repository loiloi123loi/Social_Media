<template>
  <div class="login-container">
    <div class="form-wrapper">
      <h1>Welcome Back!</h1>
      <p class="subtitle">Login to access your account</p>
      <form @submit.prevent="handleLogin" novalidate>
        <InputField
          ref="emailRef"
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
          ref="passwordRef"
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
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface IFormErrors {
  email?: string
  password?: string
}

const router = useRouter()
const toast = useToast()
const form = ref<ILoginRequestData>({ email: '', password: '' })
const errors = ref<IFormErrors>({})
const showPassword = ref(false)
const { login } = useAuthStore()

const emailRef = ref<InstanceType<typeof InputField> | null>(null)
const passwordRef = ref<InstanceType<typeof InputField> | null>(null)

const fieldRefs = {
  email: emailRef,
  password: passwordRef,
}

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

const validateForm = () => {
  let isValid = true
  const fields: (keyof ILoginRequestData)[] = ['email', 'password']

  fields.forEach((field) => {
    validateField(field)
    if (errors.value[field]) {
      isValid = false
    }
  })

  if (!isValid) {
    const firstErrorField = fields.find((field) => errors.value[field])
    if (firstErrorField) {
      fieldRefs[firstErrorField]?.value?.focus()
    }
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) {
    return
  }
  const response = await login(form.value)

  if (!response.isSuccess) {
    const respError = response.errors
    if (respError) {
      toast.add({
        severity: 'error',
        summary: 'Login Failed',
        detail: Object.keys(respError)
          .map((key) => respError[key].msg)
          .join(', '),
        life: 3000,
        group: 'tr',
      })
    }
    return
  }

  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: response.message,
    life: 3000,
    group: 'tr',
  })
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

.form-wrapper form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
