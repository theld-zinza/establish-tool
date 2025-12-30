<template>
  <div class="flex" style="height: calc(100vh - 4rem);">
    <CloneDataSidebar />
    <main class="flex-1 overflow-auto">
      <div class="p-6">
        <!-- Required Fields Section -->
        <div class="mb-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">SQL UPDATE LOCAL DATA</h2>
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Local project_hash *</label>
              <input 
                type="text" 
                v-model="cloneStore.localColumns.project_hash"
                class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="project_hash"
                required
              />
            </div>
          </div>
          
          <!-- Generate Button -->
        <div class="mt-4 flex gap-3">
          <button 
            @click="genUpdateSQL"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            Generate Update SQL
          </button>
          <button 
            @click="copyAllSQL"
            :disabled="generatedSQLs.length === 0"
            class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Copy All SQL
          </button>
        </div>
        </div>

        <!-- Display Area -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">Output</h3>
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-96">
            <div v-if="generatedSQLs.length === 0" class="text-gray-500 text-center py-8">
              <p>Output will be displayed here...</p>
            </div>
            <div v-else class="space-y-4">
              <div v-for="(sql, index) in generatedSQLs" :key="index" class="bg-white p-3 rounded border overflow-x-auto">
                <pre class="text-sm font-mono whitespace-pre-wrap">{{ sql }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <ConfirmModal 
      :show="showCopyConfirm"
      title="CHÚ Ý"
      message="Hãy kiểm tra môi trường thật kỹ trước khi chạy SQL. Đảm bảo chỉ chạy SQL ở môi trường test."
      confirm-text="Đồng Ý và copy SQL"
      @confirm="executeCopy"
      @cancel="showCopyConfirm = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCloneStore } from '../stores/cloneStore'
import { useGlobalToast } from '../composables/useToast'

const cloneStore = useCloneStore()
const toast = useGlobalToast()
import CloneDataSidebar from '../components/CloneDataSidebar.vue'
import ConfirmModal from '../components/ConfirmModal.vue'

const showCopyConfirm = ref(false)

// Generated SQLs for display
const generatedSQLs = ref([])

// Generate Update SQL function
const genUpdateSQL = () => {
  if (!cloneStore.localColumns.project_hash) {
    toast.warning('Please fill in project hash!')
    return
  }
  
  const updateSQLs = cloneStore.visibleTables
    .map(tableKey => cloneStore.generateUpdateSQL(tableKey))
    .filter(Boolean)
  
  generatedSQLs.value = updateSQLs
  
  if (!updateSQLs.length) {
    toast.error('No SQL generated. Check your data and table selections.')
  }
  
  return updateSQLs
}

// Copy all generated SQLs to clipboard
const copyAllSQL = () => {
  if (generatedSQLs.value.length === 0) {
    toast.warning('No SQL to copy!')
    return
  }
  showCopyConfirm.value = true
}

const executeCopy = async () => {
  try {
    await navigator.clipboard.writeText(generatedSQLs.value.join('\n\n'))
    toast.success('All SQL copied to clipboard!')
    showCopyConfirm.value = false
  } catch (err) {
    toast.error('Failed to copy SQL to clipboard')
  }
}
</script>
