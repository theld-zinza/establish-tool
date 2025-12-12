import { defineStore } from 'pinia'

export const useApiStore = defineStore('api', {
  state: () => ({
    signnApis: [
      'Auth Company Signature API',
      'Signature Certificate API', 
      'Sign Zip File API',
      'Get signature certificate result API',
      'Authen Company API',
      'User Certificate API',
      'Sign Access Key API',
      'Get user certificate result API',
      'Authen User API'
    ]
  }),

  getters: {
    isSignnApi: (state) => (apiName) => state.signnApis.includes(apiName),
    getUnsignnApis: (state) => (apiList) => apiList.filter(api => !state.signnApis.includes(api))
  },

  actions: {
    addSignnApi(apiName) {
      if (!this.signnApis.includes(apiName)) {
        this.signnApis.push(apiName)
      }
    },

    addSignnApis(apiList) {
      apiList.forEach(api => this.addSignnApi(api))
    },

    removeSignnApi(apiName) {
      const index = this.signnApis.indexOf(apiName)
      if (index > -1) {
        this.signnApis.splice(index, 1)
      }
    }
  }
})
