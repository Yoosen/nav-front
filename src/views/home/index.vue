<template>
  <el-container class="layout">
    <SideMenu @selectCategory="scrollToCategory" />
    <el-container class="main">
      <el-main class="content" ref="contentRef">
        <!-- 收藏分类 -->
        <div id="category-favorite">
          <h2 class="category-title">我的收藏</h2>
          <div class="link-grid" v-if="collectStore.collects.length">
            <div v-for="link in collectStore.collects" :key="link.id" class="link-card">
              <a :href="link.url" target="_blank" class="link-content">
                <img class="link-icon" :src="link.icon || '/default-icon.png'" :alt="link.title">
                <div class="link-info">
                  <div class="link-title">{{ link.title }}</div>
                  <div class="link-desc">{{ link.description }}</div>
                </div>
              </a>
              <div class="collect-btn" @click.stop="toggleCollect(link)">
                <el-icon>
                  <el-icon-star-filled v-if="collectStore.isCollected(link.id)" />
                  <el-icon-star v-else />
                </el-icon>
              </div>
            </div>
          </div>
          <div v-else class="empty-tip">
            还没有收藏的网站，点击网站卡片右上角的星标即可收藏
          </div>
        </div>
        <!-- 其他分类 -->
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
              <div class="collect-btn" @click.stop="toggleCollect(link)">
                <el-icon>
                  <el-icon-star-filled v-if="collectStore.isCollected(link.id)" />
                  <el-icon-star v-else />
                </el-icon>
              </div>
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
import type { NavCategory, NavLink } from '@/types/nav'
import { useCollectStore } from '@/stores/collect'
import SideMenu from '@/components/SideMenu.vue'

const contentRef = ref()
const categories = ref<NavCategory[]>([])
const collectStore = useCollectStore()

const toggleCollect = (link: NavLink) => {
  collectStore.toggleCollect(link)
}

const scrollToCategory = (categoryId: string | number) => {
  const elementId = categoryId === 'favorite' ? 'category-favorite' : `category-${categoryId}`
  const targetElement = document.getElementById(elementId)
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
  collectStore.initCollects()
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
  position: relative;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  transition: all 0.2s;
  height: 100%;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    
    .collect-btn {
      opacity: 1;
    }
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

.collect-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s;
  color: #999;
  z-index: 1;
  
  &:hover {
    color: #1890ff;
  }

  .el-icon {
    font-size: 16px;
  }
}

.empty-tip {
  text-align: center;
  color: #999;
  padding: 32px 0;
  font-size: 14px;
}
</style> 