<template>
  <el-card 
    class="website-card cursor-pointer hover:shadow-lg transition-shadow"
    @click="$emit('click')"
  >
    <div class="flex items-center space-x-3">
      <div class="w-10 h-10 flex-shrink-0">
        <img
          :src="website.icon"
          :alt="website.name"
          class="w-full h-full object-contain"
        />
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="font-medium text-gray-900 truncate">{{ website.name }}</h3>
        <p class="text-sm text-gray-500 truncate">{{ website.description }}</p>
      </div>
      <div class="flex-shrink-0" @click.stop="toggleFavorite">
        <el-icon 
          :class="{ 'text-blue-500': isFavorite }"
          class="text-xl hover:text-blue-500 transition-colors"
        >
          <template v-if="isInFavorites">
            <Delete />
          </template>
          <template v-else>
            <Star v-if="!isFavorite" />
            <StarFilled v-else />
          </template>
        </el-icon>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Star, StarFilled, Delete } from '@element-plus/icons-vue'
import { useWebsiteStore } from '@/stores/website'

const websiteStore = useWebsiteStore()

interface Props {
  website: {
    id: number
    name: string
    url: string
    icon: string
    description: string
  }
  isInFavorites?: boolean
}

const props = defineProps<Props>()

const isFavorite = ref(false)

// 监听收藏状态变化
watch(() => websiteStore.isFavorite(props.website.id), (newValue) => {
  isFavorite.value = newValue
})

onMounted(() => {
  isFavorite.value = websiteStore.isFavorite(props.website.id)
})

const toggleFavorite = () => {
  if (props.isInFavorites || isFavorite.value) {
    websiteStore.removeFavorite(props.website)
  } else {
    websiteStore.addFavorite(props.website)
  }
  // 移除这行，让 watch 来处理状态更新
  // isFavorite.value = !isFavorite.value
}
</script>