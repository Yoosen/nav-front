# 网址导航项目

## 项目介绍
一个简洁优雅的网址导航站点，帮助用户快速整理和访问常用网站。

## 功能特性
- 🚀 分类展示网站导航
- ⭐️ 网站收藏功能
- 🔍 站内搜索
- 📱 响应式布局
- 🎨 简洁优雅的界面设计

## 预览

![用户端](./images/用户端.png)

![用户端截图](./images/用户端2.png)

## 技术栈

## 技术栈
- Vue 3
- TypeScript
- Vite
- Element Plus
- Pinia
- Vue Router
- Axios
- Sass

## 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装依赖

```bash
npm install
```

### 启动项目
```bash
npm run dev
```

## 项目结构

```
nav-front
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 接口
│   ├── assets/            # 资源文件
│   ├── components/        # 公共组件
│   ├── router/            # 路由配置
│   ├── stores/            # 状态管理
│   ├── styles/            # 全局样式
│   ├── types/            # TypeScript 类型
│   ├── utils/            # 工具函数
│   └── views/            # 页面视图
├── .env                   # 环境变量
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts

## 使用说明

- 点击网站卡片右上角的星标可以收藏/取消收藏
- 收藏的网站会显示在"我的收藏"分类下
- 收藏数据使用 localStorage 存储，刷新页面不会丢失
