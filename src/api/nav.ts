import request from '@/utils/request'

// 获取所有分类及其下的链接
export const getAllNavData = () => {
  return request({
    url: '/nav/view/categories',
    method: 'get'
  })
}

// 搜索链接
export const searchNavLinks = (keyword: string) => {
  return request({
    url: '/nav/view/links/search',
    method: 'get',
    params: { keyword }
  })
} 