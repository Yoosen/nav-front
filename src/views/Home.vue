<template>
  <div class="home">
    <SideMenu 
      :currentCategory="currentCategory"
      @selectCategory="handleCategorySelect"
    />
    <div class="main-content">
      <header class="header">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchText"
            placeholder="搜索网站..."
            @input="handleSearch"
          >
        </div>
      </header>
      <NavList />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { searchNavLinks } from '@/api/nav'
import NavList from '../components/NavList.vue'
import SideMenu from '../components/SideMenu.vue'

const searchText = ref('')
const currentCategory = ref<string | number>('favorite')  // 默认选中收藏分类

const handleSearch = async () => {
  if (!searchText.value) return
  try {
    const res = await searchNavLinks(searchText.value)
    // TODO: 处理搜索结果
    console.log('搜索结果:', res.data)
  } catch (error) {
    console.error('搜索失败:', error)
  }
}

const handleCategorySelect = (categoryId: string | number) => {
  currentCategory.value = categoryId
}
</script>

<style scoped lang="scss">
.home {
  min-height: 100vh;
  background: #f5f5f5;
}

.main-content {
  margin-left: 200px;
}

.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.search-box {
  max-width: 500px;
  margin: 0 auto;
  
  input {
    width: 100%;
    padding: 10px 16px;
    border: 1px solid #ddd;
    border-radius: 24px;
    font-size: 14px;
    outline: none;
    transition: all 0.3s;
    
    &:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(64,158,255,0.1);
    }
  }
}
</style> 