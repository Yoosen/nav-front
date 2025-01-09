<template>
  <el-container class="layout">
    <SideMenu @selectCategory="scrollToCategory" :currentCategory="currentCategory" />
    <el-container class="main">
      <el-scrollbar class="content" ref="contentRef">
        <!-- 收藏分类 -->
        <div id="category-favorite">
          <h2 class="category-title">我的收藏</h2>
          <div class="link-grid" v-if="collectStore.collects.length">
            <div v-for="link in collectStore.collects" :key="link.id" class="link-card" @click="openLink(link.url)">
              <div class="link-content">
                <img 
                  class="link-icon" 
                  :src="link.icon || '/default-icon.png'"
                  :alt="link.title"
                >
                <div class="link-info">
                  <div class="link-title">{{ link.title }}</div>
                  <div class="link-desc">{{ link.description }}</div>
                </div>
              </div>
              <div class="collect-btn" @click.stop="toggleCollect(link)">
                <el-icon>
                  <StarFilled v-if="collectStore.isCollected(link.id)" />
                  <Star v-else />
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
            <div v-for="link in category.navLinks" :key="link.id" class="link-card" @click="openLink(link.url)">
              <div class="link-content">
                <img 
                  class="link-icon" 
                  :src="link.icon || '/default-icon.png'"
                  :alt="link.title"
                >
                <div class="link-info">
                  <div class="link-title">{{ link.title }}</div>
                  <div class="link-desc">{{ link.description }}</div>
                </div>
              </div>
              <div class="collect-btn" @click.stop="toggleCollect(link)">
                <el-icon>
                  <StarFilled v-if="collectStore.isCollected(link.id)" />
                  <Star v-else />
                </el-icon>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { getAllNavData } from '@/api/nav'
import type { NavCategory, NavLink } from '@/types/nav'
import { useCollectStore } from '@/stores/collect'
import SideMenu from '@/components/SideMenu.vue'
import { Star, StarFilled } from '@element-plus/icons-vue'

const contentRef = ref()
const categories = ref<NavCategory[]>([])
const collectStore = useCollectStore()
const currentCategory = ref<string | number>('favorite')

const toggleCollect = (link: NavLink) => {
  collectStore.toggleCollect(link)
}

const scrollToCategory = (categoryId: string | number) => {
  currentCategory.value = categoryId
  const elementId = categoryId === 'favorite' ? 'category-favorite' : `category-${categoryId}`
  const targetElement = document.getElementById(elementId)
  if (targetElement) {
    targetElement.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }
}

// 创建 Intersection Observer
let observer: IntersectionObserver | null = null

const setupIntersectionObserver = () => {
  // 配置 observer
  const options = {
    root: contentRef.value?.wrapRef,
    rootMargin: '0px', // 使用精确的视口边界
    threshold: 0 // 只在完全进入或离开时触发
  }

  // 获取所有分类的顺序
  const getCategoryOrder = () => ['favorite', ...categories.value.map(c => c.id.toString())]

  observer = new IntersectionObserver((entries) => {
    const categoryOrder = getCategoryOrder()
    
    entries.forEach(entry => {
      // 从父元素获取分类ID
      const categoryId = entry.target.closest('[id^="category-"]')?.id.replace('category-', '')
      if (!categoryId) return

      const currentOrder = categoryOrder.indexOf(currentCategory.value.toString())
      const thisOrder = categoryOrder.indexOf(categoryId)

      if (!entry.isIntersecting) {
        // 标题离开视口时，如果是当前选中的分类，切换到下一个可见的分类
        if (categoryId === currentCategory.value.toString()) {
          // 从当前分类往后找第一个标题可见的分类
          for (let i = thisOrder + 1; i < categoryOrder.length; i++) {
            const nextId = categoryOrder[i]
            const nextElement = document.getElementById(`category-${nextId}`)
            const nextTitle = nextElement?.querySelector('.category-title')
            if (nextTitle && isElementVisible(nextTitle)) {
              currentCategory.value = nextId === 'favorite' ? 'favorite' : Number(nextId)
              break
            }
          }
        }
      } else {
        // 标题进入视口时，如果它的序号小于当前选中的分类，切换到它
        if (thisOrder < currentOrder) {
          currentCategory.value = categoryId === 'favorite' ? 'favorite' : Number(categoryId)
        }
      }
    })
  }, options)

  // 检查元素是否在视口内
  const isElementVisible = (element: Element) => {
    const rect = element.getBoundingClientRect()
    const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight)
    return rect.top < viewHeight && rect.bottom > 0
  }

  // 观察所有分类标题
  const observeCategories = () => {
    // 观察收藏分类的标题
    const favoriteElement = document.getElementById('category-favorite')
    const favoriteTitle = favoriteElement?.querySelector('.category-title')
    if (favoriteTitle) observer?.observe(favoriteTitle)

    // 观察其他分类的标题
    categories.value.forEach(category => {
      const element = document.getElementById(`category-${category.id}`)
      const titleElement = element?.querySelector('.category-title')
      if (titleElement) observer?.observe(titleElement)
    })
  }

  // 等待 DOM 更新后再观察
  setTimeout(observeCategories, 100)
}

const getNavData = async () => {
  try {
    const res = await getAllNavData()
    categories.value = res.data
    // 数据加载完成后设置观察器
    setupIntersectionObserver()
  } catch (error) {
    console.error('获取导航数据失败:', error)
  }
}

// 打开链接
const openLink = (url: string) => {
  window.open(url, '_blank')
}

onMounted(() => {
  getNavData()
  collectStore.initCollects()
})

// 清理 observer
onUnmounted(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
</script>

<style scoped lang="scss">
.layout {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  background: #f5f7fa;
  box-sizing: border-box;
}

.main {
  flex: 1;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin-left: calc(200px + 1% + 20px);
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
  padding: 0;
  
  :deep(.el-scrollbar__wrap) {
  }
}

.category-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 16px 24px;
}

.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
  margin: 0 24px 32px;
}

.link-card {
  position: relative;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  transition: all 0.2s;
  height: 100%;
  cursor: pointer;
  min-width: 280px;
  
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
  min-height: 100px;
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
  padding-right: 8px;
}

.link-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.link-desc {
  font-size: 0.9rem;
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
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #FDD260;
  z-index: 1;
  
  &:hover {
    color: #1890ff;
  }

  .el-icon {
    font-size: 24px;
  }

  .el-icon-star-filled {
    color: #faad14;
    
    &:hover {
      color: #ffc53d;
    }
  }
}

.empty-tip {
  text-align: center;
  color: #999;
  padding: 32px 0;
  font-size: 14px;
}
</style>