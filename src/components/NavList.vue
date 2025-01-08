<template>
  <div class="nav-container">
    <div class="category-section" v-for="category in categories" :key="category.id">
      <h2 class="category-title">{{ category.name }}</h2>
      <div class="nav-grid">
        <div v-for="link in category.links" :key="link.id" class="nav-card">
          <a :href="link.url" target="_blank" class="card-content">
            <div class="icon-wrapper">
              <img :src="link.icon" :alt="link.title">
            </div>
            <div class="site-info">
              <h3 class="site-name">{{ link.title }}</h3>
              <p class="site-desc">{{ link.description }}</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAllNavData } from '@/api/nav'
import type { NavCategory } from '@/types/nav'

const categories = ref<NavCategory[]>([])

const getNavData = async () => {
  try {
    const res = await getAllNavData()
    console.log(res.data)
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
.nav-container {
  padding: 20px;
}

.category-section {
  margin-bottom: 30px;
}

.category-title {
  font-size: 18px;
  margin-bottom: 16px;
  padding-left: 8px;
  border-left: 4px solid var(--primary-color);
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.nav-card {
  background: #fff;
  border-radius: 8px;
  transition: all 0.3s;
  border: 1px solid #eee;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
}

.card-content {
  display: flex;
  padding: 16px;
  align-items: center;
}

.icon-wrapper {
  width: 40px;
  height: 40px;
  margin-right: 12px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.site-info {
  flex: 1;
}

.site-name {
  font-size: 16px;
  margin-bottom: 4px;
  color: #333;
}

.site-desc {
  font-size: 12px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style> 