<template>
  <div id="app" class="h-screen bg-slate-50">
    <Header />
    <router-view />
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
</script>
