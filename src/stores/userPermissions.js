// stores/counter.js
import { defineStore } from 'pinia'

export const useUserPermissions = defineStore('userPermissions', {
  state: () => {
    return { permissions: ['aaa', 'bbb'] }
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    set (permissions) {
      this.permissions = permissions
    },
  },
})