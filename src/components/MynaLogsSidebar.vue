<template>
  <div class="w-80 overflow-y-auto bg-white shadow-lg flex flex-col">
    <!-- Input Area -->
    <div class="p-4 border-b">
      <!-- Project Hash Input -->
      <div class="mb-4">
        <div class="flex space-x-2">
          <input
            v-model="projectHash"
            type="text"
            class="flex-1 border rounded-lg p-2 text-sm focus:outline-none focus:ring focus:ring-indigo-300"
            placeholder="project_hash"
          />
          <button
            @click="copySql"
            :disabled="!projectHash.trim()"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium"
          >
            Copy SQL
          </button>
        </div>
      </div>

      <label class="block text-sm font-medium mb-2">
        List Request Logs (copy row with name)
      </label>
      <textarea
        v-model="logInput"
        @keydown.enter.prevent="parseLogs"
        class="mono w-full min-h-[120px] p-3 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300 text-xs"
        placeholder="# id, auth_id, step, temp_reference_number, reference_number, project_hash, procedure_code, status_code, details, created_at, updated_at"
      ></textarea>
      <button
        @click="parseLogs"
        class="w-full mt-3 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
      >
        Parse
      </button>
      <!-- Guide Button -->
      <div class="mt-4">
        <button 
          @click="showGuide = true"
          class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
        >
        ✨ Documents ✨
        </button>
      </div>
    </div>

    <!-- Controls -->
    <div v-if="hasData" class="p-4 border-b">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Search</label>
          <input
            v-model="searchQuery"
            @input="debouncedSearch"
            type="text"
            class="w-full border rounded-lg p-2 text-sm"
            placeholder=""
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Sort by</label>
          <div class="flex items-center space-x-2">
            <select v-model="sortBy" @change="applyFilters" class="w-full border rounded-lg p-2 text-sm">
              <option value="id">id</option>
              <option value="created_at">created_at</option>
              <option value="updated_at">updated_at</option>
            </select>
            <select v-model="sortDirection" @change="applyFilters" class="w-full border rounded-lg p-2 text-sm">
              <option value="desc">DESC</option>
              <option value="asc">ASC</option>
            </select>
          </div>
        </div>
        <div>
          <div class="flex items-center">
            <input
              v-model="enableDateFilter"
              @change="toggleDateFilter"
              type="checkbox"
              id="dateFilterToggle"
              class="mr-2"
            />
            <label for="dateFilterToggle" class="text-sm font-medium cursor-pointer">Date Filter</label>
          </div>
          
          <div v-if="enableDateFilter" class="space-y-3 transition-all duration-300 ease-in-out mt-3">
            <div>
              <select v-model="dateFilterField" @change="applyFilters" class="w-full border rounded-lg p-2 text-sm">
                <option value="created_at">created_at</option>
                <option value="updated_at">updated_at</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Start Date</label>
              <input
                v-model="startDate"
                @change="applyFilters"
                type="datetime-local"
                class="w-full border rounded-lg p-2 text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">End Date</label>
              <input
                v-model="endDate"
                @change="applyFilters"
                type="datetime-local"
                class="w-full border rounded-lg p-2 text-sm"
              />
            </div>
            <div>
              <button
                @click="clearDateFilter"
                class="w-full px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
              >
                Clear Date Filter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Step Filter -->
    <div v-if="hasData" class="p-4">
      <div class="text-sm font-medium mb-3">Filter by request type</div>
      <div class="mb-4" :class="{ selected: isAllSelected }">
        <label class="flex items-center cursor-pointer">
          <input
            type="checkbox"
            :checked="isAllSelected"
            @change="toggleSelectAll"
            class="filter-checkbox"
          />
          <span class="text-sm font-medium">Select All</span>
        </label>
      </div>

      <div class="space-y-2 border rounded-lg p-2 bg-slate-50">
        <div
          v-for="step in availableSteps"
          :key="step"
          class="filter-option"
          :class="{ selected: selectedSteps.includes(step) }"
        >
          <label class="flex items-center cursor-pointer">
            <input
              type="checkbox"
              :value="step"
              v-model="selectedSteps"
              @change="applyFilters"
              class="filter-checkbox"
            />
            <span class="text-sm">{{ step }}</span>
          </label>
        </div>
      </div>
    </div>
  </div>

  <!-- Guide Modal -->
  <GuideModal 
    :show="showGuide" 
    @close="showGuide = false"
  />
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useLogStore } from '../stores/logStore'
import { useGlobalToast } from '../composables/useToast'
import GuideModal from './guide/GuideModal.vue'

const logStore = useLogStore()
const toast = useGlobalToast()

const logInput = ref('')
const projectHash = ref('')
const sortBy = ref('updated_at')
const sortDirection = ref('desc')
const searchQuery = ref('')
const selectedSteps = ref([])
const enableDateFilter = ref(false)
const dateFilterField = ref('created_at')
const startDate = ref('')
const endDate = ref('')

const showGuide = ref(false)

const hasData = computed(() => logStore.logs.length > 0)
const availableSteps = computed(() => logStore.availableSteps)
const isAllSelected = computed(() => availableSteps.value.length > 0 && selectedSteps.value.length === availableSteps.value.length)

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedSteps.value = []
  } else {
    selectedSteps.value = [...availableSteps.value]
  }
  applyFilters()
}

let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(applyFilters, 300)
}

// Data processing
const parseLogs = () => {
  if (!logInput.value.trim()) return
  logStore.parseLogs(logInput.value)
  selectedSteps.value = [...availableSteps.value]
  applyFilters()
}

// Filter management
const applyFilters = () => {
  logStore.applyFilters({
    searchQuery: searchQuery.value,
    sortBy: sortBy.value,
    sortDirection: sortDirection.value,
    selectedSteps: selectedSteps.value,
    enableDateFilter: enableDateFilter.value,
    dateFilterField: dateFilterField.value,
    startDate: startDate.value,
    endDate: endDate.value
  })
}

const toggleDateFilter = () => {
  if (!enableDateFilter.value) {
    startDate.value = ''
    endDate.value = ''
  }
  applyFilters()
}

const clearDateFilter = () => {
  startDate.value = ''
  endDate.value = ''
  applyFilters()
}

// SQL operations
const copySql = async () => {
  if (!projectHash.value.trim()) return
  
  const sql = `SELECT * FROM t_establish_logs where project_hash = "${projectHash.value.trim()}" order by updated_at desc;`
  
  try {
    await navigator.clipboard.writeText(sql)
    toast.success('SQL copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy SQL:', err)
    toast.error('Failed to copy SQL to clipboard')
  }
}

onMounted(() => {
  if (logStore.hasStoredLogs) {
    const result = logStore.loadFromLocalStorage()
    if (result.success) {
      logInput.value = result.rawText
      selectedSteps.value = [...availableSteps.value]
      applyFilters()
    }
  }
})

watch(availableSteps, (newSteps) => {
  if (newSteps.length > 0 && selectedSteps.value.length === 0) {
    selectedSteps.value = [...newSteps]
  }
})
</script>
