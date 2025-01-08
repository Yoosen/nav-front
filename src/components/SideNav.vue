<template>
  <div class="fixed left-4 top-1/2 transform -translate-y-1/2">
    <ul class="space-y-2">
      <li 
        v-for="category in categories" 
        :key="category.id"
        class="text-sm cursor-pointer hover:text-blue-500 transition-colors"
        :class="{ 'text-blue-500': activeCategory === category.id }"
        @click="scrollToCategory(category.id)"
      >
        {{ category.name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  categories: Array<{
    id: number
    name: string
  }>
}>()

const activeCategory = ref(props.categories[0]?.id)

const scrollToCategory = (categoryId: number) => {
  const element = document.getElementById(`category-${categoryId}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    activeCategory.value = categoryId
  }
}
</script> 