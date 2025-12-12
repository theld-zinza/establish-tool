import { useToast } from 'vue-toastification'

// Global toast composable
export function useGlobalToast() {
  const toast = useToast()

  return {
    // Success toast
    success: (message, options = {}) => {
      return toast.success(message, {
        timeout: 3000,
        ...options
      })
    },

    // Error toast
    error: (message, options = {}) => {
      return toast.error(message, {
        timeout: 4000,
        ...options
      })
    },

    // Warning toast
    warning: (message, options = {}) => {
      return toast.warning(message, {
        timeout: 3500,
        ...options
      })
    }
  }
}

// Export default toast instance for direct use
export default useGlobalToast
