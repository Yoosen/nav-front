export interface NavLink {
  id: number
  title: string
  url: string
  icon?: string
  description: string
  sort: number
  categoryId: number
  categoryName?: string
  status?: number
}

export interface NavCategory {
  id: number
  name: string
  icon?: string
  sort?: number
  navLinks?: NavLink[]
} 