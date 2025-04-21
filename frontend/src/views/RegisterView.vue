<template>
  <div class="register-container">
    <div class="form-wrapper">
      <h1>Create Account</h1>
      <p class="subtitle">Join us and start your journey</p>
      <form @submit.prevent="handleSubmit" novalidate>
        <InputField
          ref="nameRef"
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
        <InputField
          ref="confirmPasswordRef"
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

      <div class="separator">
        <span>OR</span>
      </div>

      <GoogleLoginButton label="Sign up with Google" />

      <p class="switch-message">
        Already have an account? <RouterLink to="/login" class="switch-link">Login here</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IRegisterRequestData } from '@/api/auth'
import Button from '@/components/Button.vue'
import GoogleLoginButton from '@/components/GoogleLoginButton.vue'
import InputField from '@/components/InputField.vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface IFormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

const router = useRouter()
const toast = useToast()
const form = ref<IRegisterRequestData>({ name: '', email: '', password: '', confirmPassword: '' })
const errors = ref<IFormErrors>({})
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const { register } = useAuthStore()

const nameRef = ref<InstanceType<typeof InputField> | null>(null)
const emailRef = ref<InstanceType<typeof InputField> | null>(null)
const passwordRef = ref<InstanceType<typeof InputField> | null>(null)
const confirmPasswordRef = ref<InstanceType<typeof InputField> | null>(null)

const fieldRefs = {
  name: nameRef,
  email: emailRef,
  password: passwordRef,
  confirmPassword: confirmPasswordRef,
}

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
  const fields: (keyof IRegisterRequestData)[] = ['name', 'email', 'password', 'confirmPassword']

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

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  const response = await register(form.value)

  if (!response.isSuccess) {
    const respError = response.errors
    if (respError) {
      toast.add({
        severity: 'error',
        summary: 'Register Failed',
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

.separator {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.5rem 0;
}

.separator::before,
.separator::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--color-border);
}

.separator span {
  padding: 0 0.75rem;
  color: var(--color-text-light);
  font-size: 0.9rem;
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
