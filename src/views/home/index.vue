<template>
  <el-container class="layout">
    <SideMenu @selectCategory="scrollToCategory" :currentCategory="currentCategory" />
    <el-container class="main">
      <el-scrollbar class="content" ref="contentRef" style="padding-right: 1%;">
        <HeaderBanner />
        <!-- 收藏分类 -->
        <div id="category-favorite">
          <h2 class="category-title">我的收藏</h2>
          <div class="link-grid">
            <div v-for="link in collectStore.collects" 
              :key="link.id" 
              class="link-card"
            >
              <div class="link-content" @click="openLink(link.url)">
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
            <div v-if="!collectStore.collects.length" class="empty-tip">
              还没有收藏的网站，点击网站卡片右上角的星标即可收藏
            </div>
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
            <div v-for="link in category.navLinks" 
              :key="link.id" 
              class="link-card"
            >
              <div class="link-content" @click="openLink(link.url)">
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
        <FooterNav />
      </el-scrollbar>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { getAllNavData } from '@/api/nav'
import type { NavCategory, NavLink } from '@/types/nav'
import { useCollectStore } from '@/stores/collect'
import { Star, StarFilled } from '@element-plus/icons-vue'
import HeaderBanner from '@/components/HeaderBanner.vue'
import FooterNav from '@/components/FooterNav.vue'
import SideMenu from '@/components/SideMenu.vue'

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
  margin-left: 240px; 
  padding-left: 2rem; 
}

.content {
  flex: 1;
  padding: 0;
  overflow-x: hidden;
}

.category-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 1.5rem 1rem 1rem;
}

#category-favorite,
[id^="category-"] {
  margin: 0 1rem;
}

.link-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  padding: 0 1rem;
  margin-right: 1rem; 
}

// 响应式布局
@media screen and (max-width: 1400px) {
  .link-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media screen and (max-width: 1200px) {
  .link-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media screen and (max-width: 992px) {
  .link-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 768px) {
  .link-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}

.link-card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 0.5rem;
  transition: all 0.2s;
  cursor: pointer;
  position: relative;
  height: 7.5rem;
  padding: 1rem;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-0.125rem);
    box-shadow: 0 0.25rem 0.75rem rgba(0,0,0,0.05);
  }
}

.link-content {
  display: flex;
  height: 100%;
  align-items: flex-start;
  gap: 1rem;
}

.link-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 0.25rem;
  flex-shrink: 0;
}

.link-info {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.link-title {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.link-desc {
  font-size: 0.875rem;
  color: #666;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.collect-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: #f7ba2a;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #666;
  }

  .is-collected {
    color: #f7ba2a;
  }
}

.empty-tip {
  text-align: center;
  color: #999;
  font-size: 0.875rem;
  padding: 2rem 0;
}

// 顶部背景区域样式
.header-banner {
  height: 16.25rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  margin: 1.5rem 1.5rem 3rem;
  border-radius: 0.75rem;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('https://source.unsplash.com/random/1600x900/?technology') center/cover;
    opacity: 0.2;
    z-index: 1;
  }

  .banner-content {
    position: relative;
    z-index: 2;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    text-align: center;
    padding: 0 1.25rem;

    h1 {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 1rem;
      letter-spacing: 0.125rem;
    }

    p {
      font-size: 1.125rem;
      opacity: 0.9;
      max-width: 37.5rem;
    }
  }
}

// 底部导航简介样式
.footer {
  margin: 3.75rem 1.5rem 1.5rem;
  padding: 2.5rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.04);

  .footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(18.75rem, 1fr));
    gap: 2.5rem;
    margin-bottom: 2.5rem;

    h3 {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 1.25rem;
      color: #333;
    }

    p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        color: #666;
        margin-bottom: 0.75rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
    }

    .social-links {
      a {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        color: #666;
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        transition: all 0.2s;

        &:hover {
          color: #1890ff;
          background: rgba(24, 144, 255, 0.1);
        }

        .el-icon {
          font-size: 1.125rem;
        }
      }
    }
  }

  .copyright {
    text-align: center;
    color: #999;
    padding-top: 1.5rem;
    border-top: 1px solid #eee;
  }
}

// 收藏分类和其他分类的容器样式
#category-favorite,
[id^="category-"] {
  margin: 0;
}
</style>