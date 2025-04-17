<template>
  <div class="register-container">
    <div class="form-wrapper">
      <h1>Create Account</h1>
      <p class="subtitle">Join us and start your journey</p>
      <form @submit.prevent="handleSubmit" novalidate>
        <InputField
          label="Name"
          v-model="form.name"
          type="text"
          placeholder="Enter your name"
          required
          :error-message="errors.name"
          @blur="validateField('name')"
          @validate="validateField('name')"
        />
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
        <InputField
          label="Confirm Password"
          v-model="form.confirmPassword"
          placeholder="Enter your confirm password"
          :type="showConfirmPassword ? 'text' : 'password'"
          :suffix-icon="`${showConfirmPassword ? 'pi-eye' : 'pi-eye-slash'}`"
          @suffix-click="() => (showConfirmPassword = !showConfirmPassword)"
          required
          :error-message="errors.confirmPassword"
          @blur="validateField('confirmPassword')"
          @validate="validateField('confirmPassword')"
        />
        <Button label="Register" type="submit" />
      </form>
      <p class="switch-message">
        Already have an account? <RouterLink to="/login" class="switch-link">Login here</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IRegisterRequestData } from '@/api/auth'
import Button from '@/components/Button.vue'
import InputField from '@/components/InputField.vue'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface IFormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

const router = useRouter()
const form = ref<IRegisterRequestData>({ name: '', email: '', password: '', confirmPassword: '' })
const errors = ref<IFormErrors>({})
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const { register } = useAuthStore()
const nameInput = ref<InstanceType<typeof InputField> | null>(null)

const validateField = (field: keyof IRegisterRequestData) => {
  errors.value[field] = ''

  switch (field) {
    case 'name':
      if (!form.value.name) {
        errors.value.name = 'Name is required'
      }
      break
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
      } else if (form.value.password.length < 6) {
        errors.value.password = 'Password must be at least 6 characters'
      }
      if (form.value.password !== form.value.confirmPassword) {
        errors.value.confirmPassword = 'Confirm password does not match'
      }
      break
    case 'confirmPassword':
      if (form.value.password !== form.value.confirmPassword) {
        errors.value.confirmPassword = 'Confirm password does not match'
      }
      break
  }
}

const validateForm = () => {
  let isValid = true
  const fields: (keyof IRegisterRequestData)[] = ['name', 'email', 'password']

  fields.forEach((field) => {
    validateField(field)
    if (errors.value[field]) {
      isValid = false
    }
  })

  if (!isValid) {
    const firstErrorField = fields.find((field) => errors.value[field])
    if (firstErrorField === 'name' && nameInput.value) {
      nameInput.value.focus()
    }
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  await register(form.value)
  router.push({ name: 'Home' })
}
</script>

<style scoped>
.register-container {
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
