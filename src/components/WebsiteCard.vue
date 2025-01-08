<template>
  <div class="link-card">
    <a :href="link.url" target="_blank" class="link-content">
      <img class="link-icon" :src="link.icon || '/default-icon.png'" :alt="link.title">
      <div class="link-info">
        <div class="link-title">{{ link.title }}</div>
        <div class="link-desc">{{ link.description }}</div>
      </div>
    </a>
    <div class="favorite-btn" @click.stop="toggleFavorite">
      <el-icon :class="{ 'is-favorite': isFavorite }">
        <Star />
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Star } from '@element-plus/icons-vue'
import { useFavoriteStore } from '@/stores/favorite'
import type { NavLink } from '@/types/nav'

const props = defineProps<{
  link: NavLink
}>()

const favoriteStore = useFavoriteStore()

const isFavorite = computed(() => favoriteStore.isFavorite(props.link.id))

const toggleFavorite = () => {
  if (isFavorite.value) {
    favoriteStore.removeFavorite(props.link)
  } else {
    favoriteStore.addFavorite(props.link)
  }
}
</script>

<style scoped lang="scss">
.favorite-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  cursor: pointer;
  color: #999;
  transition: all 0.2s;
  
  &:hover {
    color: #1890ff;
  }
  
  .is-favorite {
    color: #1890ff;
  }
}

// ... 其他样式保持不变 ...
</style>