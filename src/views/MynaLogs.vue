<template>
  <div class="flex h-[calc(100vh-4rem)]">
    <MynaLogsSidebar />
    <main class="flex-1 overflow-auto p-6">
      <LogViewer />
    </main>
  </div>
</template>

<script setup>
import LogViewer from '../components/LogViewer.vue'
import MynaLogsSidebar from '../components/MynaLogsSidebar.vue'
</script>
