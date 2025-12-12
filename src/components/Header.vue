<template>
  <header class="bg-white shadow-sm border-b">
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center space-x-8">
          <router-link to="/" class="text-xl font-semibold text-gray-900 hover:text-indigo-600">
            Establish Tool
          </router-link>
          <router-link 
            to="/myna-logs" 
            class="text-sm transition-colors"
            :class="$route.path === '/myna-logs' ? 'text-indigo-600 font-medium' : 'text-gray-600 hover:text-indigo-600'"
          >
            Myna Logs Viewer
          </router-link>
          <router-link 
            to="/clone-data" 
            class="text-sm transition-colors"
            :class="$route.path === '/clone-data' ? 'text-indigo-600 font-medium' : 'text-gray-600 hover:text-indigo-600'"
          >
            Clone Project Data
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
