<template>
  <div class="side-menu">
    <div class="menu-content">
      <!-- 收藏分类 -->
      <div 
        class="menu-item"
        :class="{ active: currentCategory === 'favorite' }"
        @click="handleCategoryClick('favorite')"
      >
        <el-icon><Star /></el-icon>
        <span class="menu-text">我的收藏</span>
      </div>
      <!-- 其他分类 -->
      <div 
        v-for="category in categories" 
        :key="category.id"
        class="menu-item"
        :class="{ active: currentCategory === category.id }"
        @click="handleCategoryClick(category.id)"
      >
        <el-icon>
          <component :is="getCategoryIcon(category.id)" />
        </el-icon>
        <span class="menu-text">{{ category.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  Star,
  Tools,
  Document,
  Monitor,
  Collection,
  Link,
  Reading,
  Platform
} from '@element-plus/icons-vue'
import { getAllNavData } from '@/api/nav'
import type { NavCategory } from '@/types/nav'

const currentCategory = ref<string | number>('favorite')  // 默认选中收藏
const categories = ref<NavCategory[]>([])

const emit = defineEmits(['selectCategory'])

const handleCategoryClick = (categoryId: string | number) => {
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

// 根据分类ID返回对应的图标
const getCategoryIcon = (categoryId: number) => {
  const iconMap: Record<number, any> = {
    1: Tools,      // 开发工具
    2: Document,   // 文档
    3: Monitor,    // 监控
    4: Collection, // 资源
    5: Link,       // 常用链接
    6: Reading,    // 学习
    7: Platform    // 平台
  }
  return iconMap[categoryId] || Platform
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
  height: 80vh;
  background: #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  overflow-y: auto;
  overflow-x: hidden;
}

.menu-content {
  padding: 16px 0;
}

.menu-item {
  padding: 12px 16px;
  margin: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  color: #666;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  
  .el-icon {
    margin-right: 10px;
    font-size: 18px;
  }
  
  &:hover {
    color: #333;
    background: #f5f7fa;
  }
  
  &.active {
    color: #1890ff;
    background: #e6f7ff;
  }
}

.menu-text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}
</style> 