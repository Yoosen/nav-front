import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { NavLink } from '@/types/nav'

export const useFavoriteStore = defineStore('favorite', () => {
  const favorites = ref<NavLink[]>([])

  // 初始化时从 localStorage 加载收藏数据
  const initFavorites = () => {
    const saved = localStorage.getItem('favorites')
    if (saved) {
      favorites.value = JSON.parse(saved)
    }
  }

  // 添加收藏
  const addFavorite = (link: NavLink) => {
    if (!favorites.value.some(fav => fav.id === link.id)) {
      favorites.value.push(link)
      saveFavorites()
    }
  }

  // 移除收藏
  const removeFavorite = (link: NavLink) => {
    const index = favorites.value.findIndex(fav => fav.id === link.id)
    if (index > -1) {
      favorites.value.splice(index, 1)
      saveFavorites()
    }
  }

  // 检查是否已收藏
  const isFavorite = (linkId: number) => {
    return favorites.value.some(fav => fav.id === linkId)
  }

  // 保存到 localStorage
  const saveFavorites = () => {
    localStorage.setItem('favorites', JSON.stringify(favorites.value))
  }

  return {
    favorites,
    initFavorites,
    addFavorite,
    removeFavorite,
    isFavorite
  }
}) 