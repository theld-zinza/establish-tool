<template>
  <div class="w-80 bg-white shadow-lg flex flex-col overflow-y-auto">
    <h3 class="text-2xl font-medium p-4">PRODUCTION DATA</h3>
    <div class="p-4 border-b">
      <label class="block text-sm font-medium text-gray-700 mb-2">Production project_hash *</label>
      <input 
        type="text" 
        class="w-full border rounded-lg p-2 text-sm" 
        placeholder="project_hash" 
        id="prod_project_hash"
        v-model="cloneStore.prodColumns.project_hash"
        @input="handleProdHashChange($event)"
      >
    </div>
    <!-- Clone Data Controls -->
    <div class="p-4">
      <div class="space-y-4">
        <div v-for="table in PROD_TABLES" :key="table.key">
          <div class="flex items-center gap-2">
            <input 
              type="checkbox" 
              :id="`checkbox_${table.key}`"
              v-model="cloneStore.tableVisibility[table.key]"
            />
            <label :for="`checkbox_${table.key}`" class="text-sm font-medium cursor-pointer">{{ table.key }}</label>
          </div>
          <textarea
            v-if="cloneStore.tableVisibility[table.key]"
            v-model="cloneStore.prodData[table.key]"
            class="w-full border rounded-lg p-2 text-sm"
            :placeholder="table.multiple ? 'Copy row with name... (can be multiple)' : 'Copy row with name...'"
          />
        </div>
      </div>
      
      <!-- Copy All SQL Button -->
      <div v-if="cloneStore.prodColumns.project_hash && cloneStore.prodColumns.project_hash.trim()" class="p-4 border-t">
        <button 
          @click="copyAllCheckedSQL"
          class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
        >
          Copy Select SQL
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useCloneStore } from '../stores/cloneStore'
import { useGlobalToast } from '../composables/useToast'

const cloneStore = useCloneStore()
const toast = useGlobalToast()

// Table configurations
const PROD_TABLES = [
  { key: 't_projects', multiple: false, condition: ['project_hash','project_id','auth_id','company_id'] },
  { key: 't_establish_request_procedures', multiple: true, condition: ['project_id'] },
  { key: 't_establish_request_messages', multiple: true, condition: ['project_id'] },
  { key: 'm_company', multiple: false, condition: ['auth_id','company_id'] },
  { key: 't_project_company_info', multiple: false, condition: ['project_id','auth_id','company_id'] },
  { key: 't_establish_submission_info', multiple: false, condition: ['project_id'] },
  { key: 't_moj_fields', multiple: false, condition: ['project_id'] },
]

// Watch for changes in prodData and copy to prodSql
watch(() => cloneStore.prodData, (newData) => {
  Object.keys(newData).forEach(tableKey => {
    if (cloneStore.tableVisibility[tableKey] && newData[tableKey]) {
      cloneStore.updateProdSql(tableKey, newData[tableKey])
    }
  })
}, { deep: true })

// Watch for changes in tableVisibility and copy data if table becomes visible
watch(() => cloneStore.tableVisibility, (newVisibility) => {
  Object.keys(newVisibility).forEach(tableKey => {
    if (newVisibility[tableKey] && cloneStore.prodData[tableKey]) {
      cloneStore.updateProdSql(tableKey, cloneStore.prodData[tableKey])
    }
  })
}, { deep: true })

// Handle project hash change - generate SQL for all tables
const handleProdHashChange = (event) => {
  const projectHash = event.target.value
  
  if (!projectHash || projectHash.trim() === '') {
    // Clear all SQL if no project hash
    PROD_TABLES.forEach(table => {
      cloneStore.updateProdSql(table.key, '')
    })
    return
  }
  
  // Generate SQL for all tables based on their conditions
  PROD_TABLES.forEach(table => {
    const sql = generateSelectSQLForTable(table, projectHash)
    cloneStore.updateProdSql(table.key, sql)
  })
}

// Generate SELECT SQL for table based on conditions
const generateSelectSQLForTable = (table, projectHash) => {
  const conditions = {
    'project_id': `project_id IN (SELECT p.project_id FROM (SELECT project_id FROM t_projects WHERE project_hash = "${projectHash}") p)`,
    'project_hash': `project_hash = "${projectHash}"`,
    'company_id': `company_id IN (SELECT p.company_id FROM (SELECT company_id FROM t_projects WHERE project_hash = "${projectHash}") p)`,
    'auth_id': `auth_id IN (SELECT p.auth_id FROM (SELECT auth_id FROM t_projects WHERE project_hash = "${projectHash}") p)`
  }
  
  // Priority order: project_id -> project_hash -> company_id -> auth_id
  const priority = ['project_id', 'project_hash', 'company_id', 'auth_id']
  const whereClause = priority.find(condition => 
    table.condition.includes(condition)
  )
  
  return whereClause ? `SELECT * FROM ${table.key} WHERE ${conditions[whereClause]};` : ''
}

// Copy all checked SQL to clipboard
const copyAllCheckedSQL = async () => {
  const checkedTables = PROD_TABLES.filter(table => cloneStore.tableVisibility[table.key])
  
  if (checkedTables.length === 0) {
    toast.warning('No tables selected!')
    return
  }
  
  const allSQL = checkedTables
    .map(table => {
      const sql = cloneStore.prodSql[table.key]
      return sql?.trim() ? `-- ${table.key}\n${sql}` : null
    })
    .filter(Boolean)
  
  if (allSQL.length === 0) {
    toast.warning('No SQL content found for selected tables!')
    return
  }
  
  try {
    await navigator.clipboard.writeText(allSQL.join('\n\n'))
    toast.success('Copy select SQL successful')
  } catch (err) {
    toast.error('Failed to copy SQL to clipboard')
  }
}

</script>
