import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { NavLink } from '@/types/nav'

export const useCollectStore = defineStore('collect', () => {
  const collects = ref<NavLink[]>([])

  const initCollects = () => {
    const saved = localStorage.getItem('collects')
    if (saved) {
      collects.value = JSON.parse(saved)
    }
  }

  const toggleCollect = (link: NavLink) => {
    const index = collects.value.findIndex(item => item.id === link.id)
    if (index > -1) {
      collects.value.splice(index, 1)
    } else {
      collects.value.push(link)
    }
    saveCollects()
  }

  const isCollected = (linkId: number) => {
    return collects.value.some(item => item.id === linkId)
  }

  const saveCollects = () => {
    localStorage.setItem('collects', JSON.stringify(collects.value))
  }

  return {
    collects,
    initCollects,
    toggleCollect,
    isCollected
  }
}) 