<template>
  <div class="side-menu">
    <div class="menu-content">
      <div 
        v-for="category in categories" 
        :key="category.id"
        class="menu-item"
        :class="{ active: currentCategory === category.id }"
        @click="handleCategoryClick(category.id)"
      >
        <span class="menu-text">{{ category.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAllNavData } from '@/api/nav'
import type { NavCategory } from '@/types/nav'

const currentCategory = ref(0)
const categories = ref<NavCategory[]>([])

const emit = defineEmits(['selectCategory'])

const handleCategoryClick = (categoryId: number) => {
  currentCategory.value = categoryId
  emit('selectCategory', categoryId)
}

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
  margin-top: 5%;
  margin-left: 1%;
  width: 200px;
  height: 80%;
  background: #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  z-index: 10;
  border-radius: 12px;
}

.menu-content {
  padding: 12px 0;
  height: 100%;
  overflow-y: auto;
}

.menu-item {
  padding: 8px 16px;
  margin: 2px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  color: #666;
  display: flex;
  align-items: center;
  font-size: 13px;
  
  &:hover {
    color: #333;
    background: #f5f7fa;
  }
  
  &.active {
    color: #1890ff;
    background: #e6f7ff;
  }

  i {
    margin-right: 8px;
    font-size: 14px;
  }
}

.menu-text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style> 