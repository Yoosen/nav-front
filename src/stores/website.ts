import { defineStore } from 'pinia'

interface Website {
  id: number
  name: string
  url: string
  icon: string
  description: string
}

export const useWebsiteStore = defineStore('website', {
  state: () => ({
    favorites: [] as Website[]
  }),

  actions: {
    initFavorites() {
      const saved = localStorage.getItem('favorites')
      if (saved) {
        this.favorites = JSON.parse(saved)
      }
    },

    addFavorite(website: Website) {
      if (!this.favorites.find(f => f.id === website.id)) {
        this.favorites.push(website)
        this.saveFavorites()
      }
    },

    removeFavorite(website: Website) {
      this.favorites = this.favorites.filter(f => f.id !== website.id)
      this.saveFavorites()
    },

    isFavorite(websiteId: number) {
      return this.favorites.some(f => f.id === websiteId)
    },

    saveFavorites() {
      localStorage.setItem('favorites', JSON.stringify(this.favorites))
    }
  }
}) 