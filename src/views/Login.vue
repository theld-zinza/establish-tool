<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <input
            id="password"
            v-model="password"
            type="password"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter password"
            required
            autofocus
          />
        </div>
        <div v-if="error" class="text-red-600 text-sm">
          {{ error }}
        </div>
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          :disabled="loading"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

const password = ref('')
const error = ref('')
const loading = ref(false)

const APP_PASSWORD = import.meta.env.VITE_APP_PASSWORD

const handleLogin = () => {
  error.value = ''
  loading.value = true

  if (password.value === APP_PASSWORD) {
    localStorage.setItem('app_auth', password.value)
    router.push('/')
  } else {
    error.value = 'Password is incorrect'
    loading.value = false
  }
}
</script>

