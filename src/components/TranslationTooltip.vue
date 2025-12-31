<template>
  <Teleport to="body">
    <div 
      v-if="showTooltip"
      :style="{ top: tooltipPosition.top, left: tooltipPosition.left }"
      class="fixed z-[9999] -translate-x-1/2 -translate-y-full pb-2"
    >
      <div class="bg-slate-800 text-white rounded shadow-lg overflow-hidden max-w-xs transition-all pointer-events-auto">
        <!-- Action Header -->
        <div class="flex items-center" :class="{ 'border-b border-slate-700': showTranslation }">
           <button 
            v-if="!showTranslation"
            @click="translateText" 
            class="px-3 py-1.5 text-sm font-medium hover:bg-slate-700 flex items-center gap-2 transition-colors w-full whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            Dịch (VI)
          </button>
          
          <div v-else class="flex items-center justify-between w-full px-2 py-1 bg-slate-900/50">
            <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Vietnamese</span>
            <button @click="closeTooltip" class="text-slate-400 hover:text-white p-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Translation Result -->
        <div v-if="showTranslation" class="p-3 text-sm leading-relaxed border-b border-slate-700/50 bg-slate-800/95 backdrop-blur">
          <div v-if="isTranslating" class="flex items-center gap-2 text-slate-400">
            <div class="animate-spin h-3 w-3 border-2 border-slate-500 border-t-white rounded-full"></div>
            Translating...
          </div>
          <div v-else-if="translationError" class="text-red-400">
             <div class="mb-1">Error: {{ translationError }}</div>
             <a 
               :href="googleTranslateUrl" 
               target="_blank" 
               class="text-indigo-400 hover:text-indigo-300 underline decoration-indigo-400/30 underline-offset-2"
             >
               Open external
             </a>
          </div>
          <div v-else class="max-h-32 overflow-y-auto selection:bg-indigo-500/30">
            {{ translatedResult }}
          </div>
        </div>
      </div>
      <!-- Triangle Arrow -->
      <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-800"></div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const showTooltip = ref(false)
const tooltipPosition = ref({ top: '0px', left: '0px' })
const selectedText = ref('')

// Translation State
const showTranslation = ref(false)
const isTranslating = ref(false)
const translatedResult = ref('')
const translationError = ref('')
const googleTranslateUrl = computed(() => 
  `https://translate.google.com/?sl=auto&tl=vi&text=${encodeURIComponent(selectedText.value)}`
)

const handleSelection = () => {
  // If translation is open, don't update selection immediately
  if (showTranslation.value) return

  const selection = window.getSelection()
  const text = selection.toString().trim()
  
  if (!text) {
    showTooltip.value = false
    return
  }
  
  // Calculate position
  try {
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    
    // Only show if selection is visible and valid
    if (rect.width > 0 && rect.height > 0) {
      updateTooltipPosition(rect)
      selectedText.value = text
      showTooltip.value = true
    } else {
      showTooltip.value = false
    }
  } catch (e) {
    showTooltip.value = false
  }
}

const updateTooltipPosition = (rect) => {
  tooltipPosition.value = {
    top: `${rect.top}px`,
    left: `${rect.left + (rect.width / 2)}px`
  }
}

const translateText = async () => {
  if (!selectedText.value) return
  
  showTranslation.value = true
  isTranslating.value = true
  translationError.value = ''
  
  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=vi&dt=t&q=${encodeURIComponent(selectedText.value)}`
    )
    
    if (!response.ok) throw new Error('Network response was not ok')
    
    const data = await response.json()
    // data structure: [[["Translated Text", "Source Text", ...], ...], ...]
    if (data && data[0]) {
      translatedResult.value = data[0].map(item => item[0]).join('')
    } else {
      throw new Error('Invalid response format')
    }
  } catch (err) {
    console.error('Translation failed:', err)
    translationError.value = 'Failed to fetch'
  } finally {
    isTranslating.value = false
  }
}

const closeTooltip = () => {
  showTooltip.value = false
  showTranslation.value = false
  window.getSelection().removeAllRanges()
}

// Hide tooltip on scroll to update position/avoid detachment
const handleScroll = () => {
  if (showTooltip.value && !showTranslation.value) { // Don't hide if reading translation
    showTooltip.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, true)
  window.addEventListener('resize', handleScroll)
  
  document.addEventListener('mousedown', (e) => {
    // Logic: if clicking inside tooltip, do nothing
    // If clicking outside, close
    const tooltipEl = document.querySelector('.fixed.z-\\[9999\\]')
    if (tooltipEl && tooltipEl.contains(e.target)) return
    
    // If clicking elsewhere and showing translation, close it
    if (showTranslation.value) {
      closeTooltip()
    }
  })
  
  document.addEventListener('selectionchange', () => {
    const selection = window.getSelection()
    // Only close if no selection AND not showing translation result
    if (!selection.toString().trim() && !showTranslation.value) {
      showTooltip.value = false
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll, true)
  window.removeEventListener('resize', handleScroll)
})

defineExpose({
  handleSelection
})
</script>
