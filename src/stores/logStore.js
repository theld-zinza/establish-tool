import { defineStore } from 'pinia'

export const useLogStore = defineStore('log', {
  state: () => ({
    logs: [],
    filteredLogs: [],
    availableSteps: [],
    columns: [
      'id', 'auth_id', 'step', 'temp_reference_number', 
      'reference_number', 'project_hash', 'procedure_code', 
      'status_code', 'details', 'created_at', 'updated_at'
    ]
  }),

  getters: {
    hasStoredLogs: () => localStorage.getItem('myna_logs') !== null
  },

  actions: {
    parseLogs(text) {
      const lines = text.split(/\r?\n/)
      const items = []
      
      for (const line of lines) {
        const row = this.parseLine(line)
        if (row) items.push(row)
      }
      
      this.logs = items
      this.filteredLogs = [...items]
      this.availableSteps = this.getUniqueSteps(items)
      
      // Save to localStorage with rawText
      this.saveToLocalStorage(text)
    },

    saveToLocalStorage(rawText = null) {
      try {
        const dataToSave = {
          logs: this.logs,
          availableSteps: this.availableSteps,
          rawText,
          timestamp: new Date().toISOString()
        }
        localStorage.setItem('myna_logs', JSON.stringify(dataToSave))
      } catch (error) {
        console.error('Error saving logs to localStorage:', error)
      }
    },

    loadFromLocalStorage() {
      try {
        const stored = localStorage.getItem('myna_logs')
        if (stored) {
          const data = JSON.parse(stored)
          this.logs = data.logs || []
          this.filteredLogs = [...this.logs]
          this.availableSteps = data.availableSteps || []
          return {
            success: true,
            rawText: data.rawText || ''
          }
        }
      } catch (error) {
        console.error('Error loading logs from localStorage:', error)
      }
      return { success: false, rawText: '' }
    },

    clearStoredLogs() {
      try {
        localStorage.removeItem('myna_logs')
        this.logs = []
        this.filteredLogs = []
        this.availableSteps = []
      } catch (error) {
        console.error('Error clearing logs from localStorage:', error)
      }
    },

    parseLine(line) {
      if (!line || line.trim().startsWith('#')) return null
      
      const out = []
      let i = 0
      const len = line.length
      
      while (i < len) {
        // Skip whitespace and commas
        while (i < len && (line[i] === ' ' || line[i] === ',')) i++
        if (i >= len) break
        
        if (line[i] === "'") {
          // Handle quoted string
          i++ // skip opening quote
          let value = ''
          while (i < len && line[i] !== "'") {
            if (line[i] === '\\' && i + 1 < len) {
              // Handle escaped characters
              i++
              if (line[i] === "'") value += "'"
              else if (line[i] === '\\') value += "\\"
              else if (line[i] === 'n') value += "\n"
              else if (line[i] === 't') value += "\t"
              else value += line[i]
            } else {
              value += line[i]
            }
            i++
          }
          if (i < len) i++ // skip closing quote
          out.push(value)
        } else if (line.substring(i, i + 4) === 'NULL') {
          out.push(null)
          i += 4
        } else {
          // Handle unquoted value
          let value = ''
          while (i < len && line[i] !== ',' && line[i] !== ' ') {
            value += line[i]
            i++
          }
          out.push(value || null)
        }
      }
      
      if (out.length === 0) return null
      
      // Pad with nulls if needed
      while (out.length < this.columns.length) out.push(null)
      
      // Map to object
      const obj = {}
      this.columns.forEach((c, i) => {
        obj[c] = out[i] ?? null
      })
      
      // Coerce id to number if possible
      if (obj.id && /^\d+$/.test(obj.id)) obj.id = Number(obj.id)
      
      // Try to parse details JSON
      const d = obj.details
      if (typeof d === 'string' && d.trim().startsWith('{')) {
        try {
          obj._detailsObj = JSON.parse(d)
        } catch (e) {
          try {
            obj._detailsObj = JSON.parse(this.decodeEscapes(d))
          } catch (e2) {
            obj._detailsObj = null
          }
        }
      } else {
        obj._detailsObj = null
      }
      
      return obj
    },

    decodeEscapes(s) {
      return s.replace(/\\n/g, '\n').replace(/\\t/g, '\t')
    },

    getUniqueSteps(items) {
      const set = new Set(items.map(x => x.step).filter(Boolean))
      return Array.from(set).sort()
    },

    applyFilters({ searchQuery, sortBy, sortDirection, selectedSteps, enableDateFilter, dateFilterField, startDate, endDate }) {
      let filtered = [...this.logs]
      
      // Step filter
      if (selectedSteps && selectedSteps.length > 0) {
        filtered = filtered.filter(x => selectedSteps.includes(x.step || ''))
      }
      
      // Date filter - only apply if enableDateFilter is true
      if (enableDateFilter && dateFilterField && (startDate || endDate)) {
        filtered = filtered.filter(x => {
          const dateValue = x[dateFilterField]
          if (!dateValue) return false
          
          const logDate = new Date(dateValue)
          if (isNaN(logDate.getTime())) return false
          
          let startMatch = true
          let endMatch = true
          
          if (startDate) {
            const start = new Date(startDate)
            startMatch = logDate >= start
          }
          
          if (endDate) {
            const end = new Date(endDate)
            endMatch = logDate <= end
          }
          
          return startMatch && endMatch
        })
      }
      
      // Search filter
      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase()
        filtered = filtered.filter(x => {
          // Search in basic fields
          const basicFields = [
            x.id, x.reference_number, x.project_hash, x.step,
            x.temp_reference_number, x.procedure_code, x.status_code
          ]
          
          // Search in details JSON object (if available)
          let detailsMatch = false
          if (x._detailsObj) {
            const detailsStr = JSON.stringify(x._detailsObj).toLowerCase()
            detailsMatch = detailsStr.includes(q)
          }
          
          // Search in details string (if JSON parsing failed)
          let detailsStringMatch = false
          if (x.details && typeof x.details === 'string') {
            detailsStringMatch = x.details.toLowerCase().includes(q)
          }
          
          return basicFields.some(v => (v || '').toString().toLowerCase().includes(q)) ||
                 detailsMatch || detailsStringMatch
        })
      }
      
      // Sort
      filtered.sort((a, b) => {
        const va = a[sortBy] ?? ''
        const vb = b[sortBy] ?? ''
        if (va < vb) return sortDirection === 'asc' ? -1 : 1
        if (va > vb) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
      
      this.filteredLogs = filtered
    }
  }
})
