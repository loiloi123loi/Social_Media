<template>
  <div class="form-group">
    <label :for="id">{{ label }}</label>
    <div :class="['input-wrapper', { error: errorMessage }]">
      <span v-if="prefixIcon" class="icon prefix-icon">
        <i :class="`pi ${prefixIcon}`" />
      </span>
      <input
        :id="id"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        :value="modelValue"
        ref="inputRef"
        @input="handleInput"
        @blur="onBlur"
      />
      <span v-if="suffixIcon" class="icon suffix-icon" @click="onSuffixClick">
        <i :class="`pi ${suffixIcon}`" />
      </span>
    </div>
    <span v-if="errorMessage" class="error-message">{{ errorMessage }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    default: () => `input-${Math.random().toString(36).substr(2, 9)}`,
  },
  prefixIcon: {
    type: String,
    default: null,
  },
  suffixIcon: {
    type: String,
    default: null,
  },
  errorMessage: {
    type: String,
    default: '',
  },
  validateOnBlur: {
    type: Boolean,
    default: true,
  },
  validateOnInput: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['suffix-click', 'update:modelValue', 'blur', 'validate'])
const inputRef = ref<HTMLInputElement | null>(null)

const onSuffixClick = () => {
  emit('suffix-click')
}

const onBlur = () => {
  emit('blur')
}

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement)?.value || ''
  emit('update:modelValue', value)
  emit('validate')
}

const focus = () => {
  inputRef.value?.focus()
}

defineExpose({ focus })
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: var(--color-text);
}

.input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0.5rem;
}

input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.5rem;
  font-size: 1rem;
}

input:focus {
  border-color: var(--color-border-hover);
}

input[type='password']::-ms-reveal {
  display: none;
}

.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.5rem;
  cursor: pointer;
}

.prefix-icon {
  margin-right: 0.5rem;
}

.suffix-icon {
  margin-left: 0.5rem;
}

.input-wrapper.error {
  border-color: var(--color-danger);
}

.error-message {
  color: var(--color-danger);
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}
</style>
