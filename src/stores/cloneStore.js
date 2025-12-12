import { defineStore } from 'pinia'

// Table configuration constants
const TABLE_NAMES = [
  't_projects',
  'm_company', 
  't_project_company_info',
  't_establish_submission_info',
  't_moj_fields',
  't_establish_request_procedures'
]

// Constants for SQL generation
const EXCLUDED_COLUMNS = ['project_hash', 'project_id', 'auth_id', 'company_id']

// Initialize empty objects for tables
const createEmptyTableObject = () => TABLE_NAMES.reduce((acc, table) => {
  acc[table] = ''
  return acc
}, {})

const createTableVisibilityObject = () => TABLE_NAMES.reduce((acc, table) => {
  acc[table] = table === 't_projects' // Only t_projects visible by default
  return acc
}, {})

export const useCloneStore = defineStore('clone', {
  state: () => ({
    // Production columns from sidebar
    prodColumns: {
      project_hash: ''
    },
    
    // Production data for textareas
    prodData: createEmptyTableObject(),
    
    // Generated SQL for each table
    prodSql: createEmptyTableObject(),
    
    // Table visibility states
    tableVisibility: createTableVisibilityObject(),
    
    // Local columns for main view
    localColumns: {
      project_hash: ''
    }
  }),

  getters: {
    // Get visible tables
    visibleTables: (state) => {
      return Object.keys(state.tableVisibility).filter(
        table => state.tableVisibility[table]
      )
    },
    
    // Get tables with SQL content
    tablesWithSql: (state) => {
      return Object.keys(state.prodSql).filter(
        table => state.prodSql[table] && state.prodSql[table].trim()
      )
    }
  },

  actions: {
    // Update production columns
    updateProdColumns(columns) {
      this.prodColumns = { ...this.prodColumns, ...columns }
    },
    
    // Update production data
    updateProdData(tableKey, data) {
      this.prodData[tableKey] = data
    },
    
    // Update production SQL
    updateProdSql(tableKey, sql) {
      this.prodSql[tableKey] = sql
    },
    
    // Update table visibility
    updateTableVisibility(tableKey, visible) {
      this.tableVisibility[tableKey] = visible
    },
    
    // Update local columns
    updateLocalColumns(columns) {
      this.localColumns = { ...this.localColumns, ...columns }
    },
    
    // Generate update SQL for specific table
    generateUpdateSQL(tableName) {
      const sql = this.prodSql[tableName]
      if (!sql || !sql.trim()) return ''
      
      // Special handling for t_establish_request_procedures
      if (tableName === 't_establish_request_procedures') {
        return this.generateDeleteAndInsertSQL(tableName, sql)
      }
      
      const data = this.parseSqlData(sql)
      if (!data) return ''
      
      // Determine WHERE clause based on table
      const whereClause = tableName === 'm_company' 
        ? `company_id IN (SELECT p.company_id FROM (SELECT company_id FROM t_projects WHERE project_hash = "${this.localColumns.project_hash}") p)`
        : `project_id IN (SELECT p.project_id FROM (SELECT project_id FROM t_projects WHERE project_hash = "${this.localColumns.project_hash}") p)`
      
      const updateSQL = `UPDATE ${tableName} SET ${data} WHERE ${whereClause};`
      
      // Generate session mode block with the actual SQL
      const sessionBlock = this.generateSessionModeBlock()
      return sessionBlock.replace('-- Your SQL statements here', updateSQL)
    },
    
    // Generate SQL mode session block
    generateSessionModeBlock() {
      return [
        '-- Disable STRICT_TRANS_TABLES to allow NULL values in NOT NULL columns',
        'SET SESSION sql_mode = REPLACE(@@sql_mode, \'STRICT_TRANS_TABLES\', \'\');',
        '',
        '-- Your SQL statements here',
        '',
        '-- Restore STRICT_TRANS_TABLES mode',
        'SET SESSION sql_mode = CONCAT(@@sql_mode, \',STRICT_TRANS_TABLES\');'
      ].join('\n')
    },
    
    // Parse SQL data to extract column=value pairs
    parseSqlData(sql) {
      if (!sql || !sql.trim()) return ''
      
      const lines = sql.trim().split('\n')
      if (lines.length < 2) return ''
      
      const headerLine = lines[0].replace('# ', '').trim()
      const dataLine = lines[1]
      
      if (!headerLine || !dataLine) return ''
      
      const headers = headerLine.split(', ').map(h => h.trim())
      
      // Parse values more carefully to handle JSON data with commas
      const values = []
      let currentValue = ''
      let inQuotes = false
      let quoteChar = null
      
      for (let i = 0; i < dataLine.length; i++) {
        const char = dataLine[i]
        
        if (!inQuotes && (char === "'" || char === '"')) {
          inQuotes = true
          quoteChar = char
          currentValue += char
        } else if (inQuotes && char === quoteChar) {
          inQuotes = false
          quoteChar = null
          currentValue += char
        } else if (!inQuotes && char === ',') {
          values.push(currentValue.trim())
          currentValue = ''
        } else {
          currentValue += char
        }
      }
      
      // Add the last value
      if (currentValue.trim()) {
        values.push(currentValue.trim())
      }
      
      if (headers.length !== values.length) {
        return ''
      }
      
      const updatePairs = []
      const excludedColumns = EXCLUDED_COLUMNS
      
      for (let i = 0; i < headers.length; i++) {
        const column = headers[i]
        const value = values[i]
        
        if (excludedColumns.includes(column)) continue
        
        // Remove single quotes from both ends if they exist
        let cleanValue = value
        if (cleanValue && cleanValue.startsWith("'") && cleanValue.endsWith("'")) {
          cleanValue = cleanValue.slice(1, -1)
        }
        
        const sqlValue = cleanValue === 'NULL' || cleanValue === '' ? 'NULL' : `"${cleanValue}"`
        updatePairs.push(`${column} = ${sqlValue}`)
      }
      
      return updatePairs.join(', ')
    },
    
    // Generate DELETE and INSERT SQL for t_establish_request_procedures
    generateDeleteAndInsertSQL(tableName, sql) {
      // First, generate DELETE statement
      const deleteSQL = `DELETE FROM ${tableName} WHERE project_id IN (SELECT p.project_id FROM (SELECT project_id FROM t_projects WHERE project_hash = "${this.localColumns.project_hash}") p);`
      
      // Parse the data to get all rows
      const lines = sql.trim().split('\n')
      if (lines.length < 2) return deleteSQL
      
      const headerLine = lines[0].replace('# ', '').trim()
      const dataLines = lines.slice(1) // Get all data lines (multiple rows)
      
      if (!headerLine || dataLines.length === 0) return deleteSQL
      
      const headers = headerLine.split(', ').map(h => h.trim())
      const insertStatements = []
      
      // Filter out 'id' column for t_establish_request_procedures
      const filteredHeaders = headers.filter(header => header !== 'id')
      const idColumnIndex = headers.findIndex(header => header === 'id')
      
      // Process each data row
      dataLines.forEach((dataLine, rowIndex) => {
        if (!dataLine.trim()) return
        
        // Parse values for this row
        const values = this.parseRowValues(dataLine)
        
        if (values.length !== headers.length) return
        
        // Filter out 'id' value and replace project_id with subquery
        const processedValues = values
          .filter((value, index) => headers[index] !== 'id') // Remove id column
          .map((value, index) => {
            const column = filteredHeaders[index]
            if (column === 'project_id') {
              return `(SELECT p.project_id FROM (SELECT project_id FROM t_projects WHERE project_hash = "${this.localColumns.project_hash}") p)`
            }
            return value
          })
        
        const insertSQL = `INSERT INTO ${tableName} (${filteredHeaders.join(', ')}) VALUES (${processedValues.join(', ')});`
        insertStatements.push(insertSQL)
      })
      
      // Combine all SQL statements
      const allSQL = [deleteSQL, ...insertStatements].join('\n')
      
      // Generate session mode block with the actual SQL
      const sessionBlock = this.generateSessionModeBlock()
      return sessionBlock.replace('-- Your SQL statements here', allSQL)
    },
    
    // Parse row values handling quotes properly
    parseRowValues(dataLine) {
      const values = []
      let currentValue = ''
      let inQuotes = false
      let quoteChar = null
      
      for (let i = 0; i < dataLine.length; i++) {
        const char = dataLine[i]
        
        if (!inQuotes && (char === "'" || char === '"')) {
          inQuotes = true
          quoteChar = char
          currentValue += char
        } else if (inQuotes && char === quoteChar) {
          inQuotes = false
          quoteChar = null
          currentValue += char
        } else if (!inQuotes && char === ',') {
          values.push(currentValue.trim())
          currentValue = ''
        } else {
          currentValue += char
        }
      }
      
      // Add the last value
      if (currentValue.trim()) {
        values.push(currentValue.trim())
      }
      
      return values
    }
  }
})
