<template>
  <div class="home">
    <!-- Redirecting to myna-logs -->
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  router.replace('/myna-logs')
})
</script>
