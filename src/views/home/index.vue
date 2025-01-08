<template>
  <el-container class="layout">
    <SideMenu @selectCategory="scrollToCategory" />
    <el-container class="main">
      <el-main class="content" ref="contentRef">
        <div 
          v-for="category in categories" 
          :key="category.id"
          :id="`category-${category.id}`"
        >
          <h2 class="category-title">{{ category.name }}</h2>
          <div class="link-grid">
            <div v-for="link in category.navLinks" :key="link.id" class="link-card">
              <a :href="link.url" target="_blank" class="link-content">
                <img class="link-icon" :src="link.icon || '/default-icon.png'" :alt="link.title">
                <div class="link-info">
                  <div class="link-title">{{ link.title }}</div>
                  <div class="link-desc">{{ link.description }}</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAllNavData } from '@/api/nav'
import type { NavCategory } from '@/types/nav'
import SideMenu from '@/components/SideMenu.vue'

const contentRef = ref()
const categories = ref<NavCategory[]>([])

const scrollToCategory = (categoryId: number) => {
  const targetElement = document.getElementById(`category-${categoryId}`)
  if (targetElement) {
    targetElement.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }
}

const getNavData = async () => {
  try {
    const res = await getAllNavData()
    categories.value = res.data
  } catch (error) {
    console.error('获取导航数据失败:', error)
  }
}

onMounted(() => {
  getNavData()
})
</script>

<style scoped lang="scss">
.layout {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  background: #f5f7fa;
}

.main {
  flex: 1;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.header {
  height: 64px !important;
  line-height: 64px;
  padding: 0 32px;
  background: #fff;
  border-bottom: 1px solid #eee;
}

.content {
  flex: 1;
  overflow-y: auto;
  min-width: 0;
  padding: 0;
  scroll-behavior: smooth;
}

.category-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 16px 24px;
}

.link-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin: 0 24px 32px;
  
  @media (max-width: 1600px) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  @media (max-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.link-card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  transition: all 0.2s;
  height: 100%;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
}

.link-content {
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  text-decoration: none;
  height: 100%;
}

.link-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  object-fit: contain;
  flex-shrink: 0;
}

.link-info {
  flex: 1;
  min-width: 0;
}

.link-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.link-desc {
  font-size: 12px;
  color: #666;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style> 