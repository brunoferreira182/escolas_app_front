// stores/counter.js
import { defineStore } from 'pinia'

export const useCurrentView = defineStore('currentView', {
  state: () => {
    return { currentView: '' }
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    set (currentView) {
      this.currentView = currentView
    },
  },
})