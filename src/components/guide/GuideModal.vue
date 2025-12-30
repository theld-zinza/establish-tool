<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b">
        <h2 class="text-xl font-semibold text-gray-900">Guide</h2>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>
      </div>
      
      <!-- Modal Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
        <!-- Tabs -->
        <div class="border-b border-gray-200 mb-6">
          <nav class="-mb-px flex space-x-8">
            <button 
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="activeTab === tab.id ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
              class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
            >
              {{ tab.label }}
            </button>
          </nav>
        </div>
        
        <!-- Tab Content -->
        <component 
          :is="activeTabComponent" 
          v-if="activeTabComponent"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SubmitEstablishCTCP from './SubmitEstablishCTCP.vue'
import StatusCodeFlow from './StatusCodeFlow.vue'
import TipsAndTricks from './TipsAndTricks.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const activeTab = ref('documents')

const tabs = [
  { id: 'documents', label: 'Documents' },
  { id: 'submit-establish', label: 'Submit Establish' },
  { id: 'submit-post-establish', label: 'Submit Post Establish' },
  { id: 'tips-and-tricks', label: 'Tips and Tricks' },
]

const activeTabComponent = computed(() => {
  switch (activeTab.value) {
    case 'submit-establish':
      return SubmitEstablishCTCP
    case 'documents':
      return StatusCodeFlow
    case 'tips-and-tricks':
      return TipsAndTricks
    default:
      return null
  }
})
</script>
