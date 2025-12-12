<template>
  <div v-if="!hasData" class="text-center py-12 text-gray-500">
    <div class="text-lg mb-2">No log data</div>
    <div class="text-sm">Please paste log data into the sidebar on the left and click Parse</div>
  </div>

  <div v-else class="space-y-3">
    <!-- Record count -->
    <div class="text-sm text-slate-600 mb-4 bg-slate-50 px-4 py-2 rounded-lg">
      Display {{ logStore.filteredLogs.length }} records
    </div>
    
    <!-- Accordion Items -->
    <div
      v-for="(log, index) in logStore.filteredLogs"
      :key="`${log.id}-${index}`"
      class="accordion-item"
    >
      <div
        class="accordion-header"
        @click="toggleAccordion(index)"
        :data-loaded="loadedItems.has(index)"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <span class="font-medium">#{{ log.id ?? "" }}</span>
            <span class="tag" :class="getStatusClass(log.status_code)">
              {{ log.status_code ?? "" }}
            </span>
            <span class="text-slate-600" :class="getStepClass(log.step)">
              {{ log.step ?? "" }}
              <span v-if="getApiHighlights(log).length > 0" class="ml-2">
                <span 
                  v-for="(highlight, idx) in getApiHighlights(log)" 
                  :key="idx"
                  :class="highlight.class"
                  class="ml-1 px-2 py-1 rounded text-xs font-medium"
                >
                  {{ highlight.text }}
                </span>
              </span>
            </span>
          </div>
          <div class="flex items-center space-x-4 text-sm text-slate-500">
            <div class="mt-2 text-xs text-slate-500">
              <span v-if="log.procedure_code">Procedure Code: {{ log.procedure_code }}</span>
              <span class="ml-4">Created: <span class="font-mono font-bold text-base">{{ log.created_at ?? "" }}</span></span>
              <span class="ml-4">Updated: <span class="font-mono font-bold text-base">{{ log.updated_at ?? "" }}</span></span>
            </div>
            <span class="text-indigo-600">{{ isOpen(index) ? '▲' : '▼' }}</span>
          </div>
        </div>
      </div>
      <div class="accordion-content" :class="{ open: isOpen(index) }">
        <div class="detail-content">
          <div v-if="!loadedItems.has(index)" class="text-center py-8 text-slate-500">
            <div class="loading-spinner mx-auto mb-2"></div>
            <div>Loading...</div>
          </div>
          <div v-else>
            <div class="mb-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div class="space-y-1">
                  <div>
                    <span class="text-slate-500">Temp Reference Number:</span>
                    <span class="font-mono">{{ log.temp_reference_number ?? "NULL" }}</span>
                  </div>
                  <div>
                    <span class="text-slate-500">Reference Number:</span>
                    <span class="font-mono">{{ log.reference_number ?? "NULL" }}</span>
                  </div>
                  <div>
                    <span class="text-slate-500">Project Hash:</span>
                    <span class="font-mono">{{ log.project_hash ?? "NULL" }}</span>
                  </div>
                </div>
                <div class="space-y-1">
                  <div>
                    <span class="text-slate-500">Procedure Code:</span>
                    <span class="font-mono break-all">{{ log.procedure_code ?? "NULL" }}</span>
                  </div>
                  <div>
                    <span class="text-slate-500">Auth ID:</span>
                    <span class="font-mono">{{ log.auth_id ?? "NULL" }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 class="font-medium text-sm mb-2">
                <span class="text-slate-600 font-bold">Details:</span>
              </h4>
              <div class="json-highlight overflow-auto detail-pre">
                <pre class="mono whitespace-pre-wrap text-xs"><code class="language-json" v-html="getFormattedJson(log)"></code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import { useLogStore } from '../stores/logStore'
import { useApiStore } from '../stores/apiStore'
import Prism from 'prismjs'

const logStore = useLogStore()
const apiStore = useApiStore()

const openItems = ref(new Set())
const loadedItems = ref(new Set())

const hasData = computed(() => logStore.filteredLogs.length > 0)

const getStatusClass = (statusCode) => {
  const status = statusCode?.toString() || ''
  if (!status) return ''
  
  const firstDigit = status.charAt(0)
  switch (firstDigit) {
    case '2':
      return 'bg-green-500 text-white'
    case '3':
      return 'bg-blue-500 text-white'
    case '4':
    case '5':
      return 'bg-red-500 text-white'
    default:
      return ''
  }
}

const isOpen = (index) => openItems.value.has(index)

const toggleAccordion = async (index) => {
  if (openItems.value.has(index)) {
    openItems.value.delete(index)
  } else {
    openItems.value.add(index)
    
    // Lazy load content if not loaded
    if (!loadedItems.value.has(index)) {
      await loadAccordionContent(index)
    }
  }
}

const loadAccordionContent = async (index) => {
  // Simulate async loading
  await new Promise(resolve => setTimeout(resolve, 50))
  
  loadedItems.value.add(index)
  
  // Highlight JSON after content is loaded
  await nextTick()
  if (typeof Prism !== 'undefined') {
    Prism.highlightAll()
  }
}

// Reset when filtered logs change
watch(() => logStore.filteredLogs, () => {
  openItems.value.clear()
  loadedItems.value.clear()
})

// JSON formatting
const getFormattedJson = (log) => {
  const pretty = log._detailsObj ? JSON.stringify(log._detailsObj, null, 2) : (log.details || '')
  return escapeHtml(pretty)
}

const escapeHtml = (str) => {
  if (!str) return ''
  return str.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

// API classification
const isUnsignnApi = (step) => step && !apiStore.isSignnApi(step)

const getStepClass = (step) => {
  return isUnsignnApi(step) 
    ? 'font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-200'
    : ''
}

// API response highlights
const getApiHighlights = (log) => {
  const highlights = []
  
  if (log.step?.includes('Get Request Detail API')) {
    try {
      const details = log._detailsObj || JSON.parse(log.details || '{}')
      
      // Error highlights
      if (details.errors?.length) {
        details.errors.forEach(error => {
          highlights.push({
            text: `error: ${error.code}`,
            class: 'bg-red-100 text-red-800 border border-red-200'
          })
        })
      }
      
      // Status code highlights
      if (details.result?._embedded?.procedures?.length) {
        details.result._embedded.procedures.forEach(procedure => {
          if (procedure.status_code) {
            highlights.push({
              text: procedure.status_code,
              class: 'bg-green-100 text-green-800 border border-green-200'
            })
          }
        })
      }
    } catch (err) {
      console.warn('Failed to parse details for API highlights:', err)
    }
  }
  
  return highlights
}
</script>
