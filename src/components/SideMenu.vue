<template>
  <div class="side-menu">
    <!-- 我的收藏固定在顶部 -->
    <div 
      class="menu-item"
      :class="{ active: currentCategory === 0 }"
      @click="currentCategory = 0"
    >
      <span class="menu-text">我的收藏</span>
    </div>
    <!-- 动态加载的分类 -->
    <div 
      v-for="category in categories" 
      :key="category.id"
      class="menu-item"
      :class="{ active: currentCategory === category.id }"
      @click="currentCategory = category.id"
    >
      <span class="menu-text">{{ category.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAllNavData } from '@/api/nav'
import type { NavCategory } from '@/types/nav'

const currentCategory = ref(0)  // 默认选中我的收藏
const categories = ref<NavCategory[]>([])

const getCategories = async () => {
  try {
    const res = await getAllNavData()
    categories.value = res.data
  } catch (error) {
    console.error('获取分类失败:', error)
  }
}

onMounted(() => {
  getCategories()
})
</script>

<style scoped lang="scss">
.side-menu {
  width: 200px;
  background: #fff;
  height: 100%;
  border-right: 1px solid #eee;
  position: relative;
}

.menu-item {
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.3s;
  color: #333;
  
  &:hover, &.active {
    color: var(--primary-color);
    background: #f6f6f6;
  }
}

.menu-text {
  font-size: 14px;
}
</style> 