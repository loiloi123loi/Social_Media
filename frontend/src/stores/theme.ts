import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: false,
    THEME_KEY: 'app-theme',
  }),

  actions: {
    toggleTheme() {
      this.isDark = !this.isDark
      this.saveTheme()
      this.applyTheme()
    },

    saveTheme() {
      localStorage.setItem(this.THEME_KEY, JSON.stringify(this.isDark))
    },

    loadTheme() {
      const saved = localStorage.getItem(this.THEME_KEY)
      if (saved !== null) {
        this.isDark = JSON.parse(saved)
        return true
      }
      return false
    },

    getSystemTheme() {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    },

    applyTheme() {
      if (this.isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },

    initTheme() {
      const hasStoredTheme = this.loadTheme()
      if (!hasStoredTheme) {
        this.isDark = this.getSystemTheme()
        this.saveTheme()
      }
      this.applyTheme()
    },
  },
})
