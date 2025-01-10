<template>
  <el-scrollbar class="side-menu">
    <el-menu
      class="menu-content"
      :default-active="props.currentCategory"
      @select="handleSelect"
    >
      <el-menu-item index="favorite">
        <el-icon><Star /></el-icon>
        <span>我的收藏</span>
      </el-menu-item>
      <el-menu-item 
        v-for="category in categories" 
        :key="category.id"
        :index="category.id.toString()"
      >
        <el-icon>
          <component :is="getCategoryIcon(category.id)" />
        </el-icon>
        <span>{{ category.name }}</span>
      </el-menu-item>
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { 
  Star,
  Monitor,
  Link,
  Promotion,
  Reading,
  VideoCamera,
  Coffee,
  Basketball,
  Briefcase,
  Box,
  Notebook,
  Opportunity
} from '@element-plus/icons-vue'
import { getAllNavData } from '@/api/nav'
import type { NavCategory } from '@/types/nav'

const props = defineProps<{
  currentCategory: string | number
}>()

const categories = ref<NavCategory[]>([])
const emit = defineEmits(['selectCategory'])

const handleSelect = (index: string) => {
  emit('selectCategory', index)
}

// 根据分类ID返回对应的图标组件
const getCategoryIcon = (id: number) => {
  const iconMap: Record<number, any> = {
    1: Monitor,      // 常用工具
    2: Link,         // 友情链接
    3: Promotion,    // 资源导航
    4: Reading,      // 文档教程
    5: VideoCamera,  // 视频学习
    6: Coffee,       // 休闲娱乐
    7: Basketball,   // 体育运动
    8: Briefcase,    // 求职招聘
    9: Box,          // 软件下载
    10: Notebook,    // 在线工具
    11: Opportunity  // 其他资源
  }
  return iconMap[id] || Monitor // 默认返回 Monitor 图标
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
  position: fixed;
  margin-top: 5%;
  margin-left: 2%;
  width: 200px;
  height: 80vh;
  background: #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  z-index: 1; /* 确保不会遮挡内容 */
  
  /* 自定义 el-scrollbar 的样式（可选） */
  :deep(.el-scrollbar__bar) {
    &.is-horizontal {
      display: none;
    }
    
    &.is-vertical {
      width: 6px;
    }
  }
}

.menu-content {
  padding: 16px 0;
}

:deep(.el-menu-item) {
  &.is-active {
    background-color: var(--el-menu-hover-bg-color);
  }

  .el-icon {
    font-size: 1.25rem;
  }
}
</style>