<template>
  <div>
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Submit Establish</h3>
    
    <div v-for="(step, index) in steps" :key="index" class="mb-6">
      <h4 class="text-md font-medium text-gray-800 mb-3">Step {{ index + 1 }}:</h4>
      <table class="w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">API</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(api, apiIndex) in step.apis" :key="apiIndex" :class="apiIndex < step.apis.length - 1 ? 'border-b' : ''">
            <td class="px-4 py-2 text-sm text-gray-900">{{ api }}</td>
            <td class="px-4 py-2 text-sm text-gray-600"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const steps = [
  {
    apis: [
      'Auth Company Signature API',
      'Signature Certificate API',
      'Sign Zip File API',
      'Get signature certificate result API'
    ]
  },
  {
    apis: [
      'Auth Company Signature API',
      'Signature Certificate API',
      'Sign Zip File API',
      'Get signature certificate result API'
    ]
  },
  {
    apis: [
      'Auth Company Signature API',
      'Signature Certificate API',
      'Sign Zip File API',
      'Get signature certificate result API'
    ]
  },
  {
    apis: [
      'Authen Company API',
      'Auth Company Signature API',
      'User Certificate API',
      'Sign Access Key API',
      'Get user certificate result API',
      'Authen User API',
      'Establish Submit application API'
    ]
  }
]
</script>
