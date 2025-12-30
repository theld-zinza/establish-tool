<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div 
        class="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all animate-in fade-in zoom-in-95 duration-200"
        @click.stop
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div class="bg-yellow-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">
            {{ title }}
          </h3>
        </div>

        <!-- Content -->
        <div class="px-6 py-4">
          <p class="text-gray-600 leading-relaxed">
            {{ message }}
          </p>
        </div>

        <!-- Actions -->
        <div class="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end gap-3">
          <button 
            @click="$emit('cancel')"
            class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Hủy bỏ
          </button>
          <button 
            @click="$emit('confirm')"
            class="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirmation'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Đồng Ý'
  }
})

defineEmits(['confirm', 'cancel'])
</script>
