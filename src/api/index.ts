import axios from "axios"

// 创建 Axios 实例
const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// 接口返回类型定义
interface ApiResponse<T> {
  data: T
  message?: string
  code: number
}

export interface Website {
  id: number
  name: string
  url: string
  icon: string
  description: string
  category_id: number
}

export interface Category {
  id: number
  name: string
  websites?: Website[]
}

// 获取所有网站信息
export const getWebsites = async (): Promise<ApiResponse<Website[]>> => {
  try {
    const response = await apiClient.get("/websites/?all_data=true")
    if (response.data && response.data.data) {
      return response.data
    }
    throw new Error('Invalid data format from /websites/ endpoint')
  } catch (error) {
    console.error("Failed to fetch websites:", error)
    throw error
  }
}

// 获取分类信息
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get("/categories/")
    if (Array.isArray(response.data)) {
      return response.data
    }
    throw new Error('Invalid data format from /categories/ endpoint')
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    throw error
  }
}

// 获取带网站的分类信息
export const getCategoriesWithWebsites = async (): Promise<Category[]> => {
  try {
    const [categories, websitesResponse] = await Promise.all([
      getCategories(),
      getWebsites()
    ])
    
    const websites = websitesResponse.data
    return categories.map(category => ({
      ...category,
      websites: websites.filter(site => site.category_id === category.id)
    }))
  } catch (error) {
    console.error("Failed to fetch categories with websites:", error)
    throw error
  }
} 