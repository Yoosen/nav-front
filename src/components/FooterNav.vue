<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="intro-section">
        <h3>关于导航</h3>
        <p>这是一个基于 Vue 3 + TypeScript 开发的导航网站，旨在提供一个简洁、优雅的导航体验。你可以收藏常用网站，快速访问各类资源。</p>
      </div>
      <div class="features-section">
        <h3>主要功能</h3>
        <ul>
          <li>✨ 网站收藏</li>
          <li>🔍 快速搜索</li>
          <li>📱 响应式设计</li>
          <li>🎨 优雅界面</li>
        </ul>
      </div>
      <div class="contact-section">
        <h3>联系方式</h3>
        <div class="social-links">
          <a href="https://github.com/yoosen" target="_blank">
            <el-icon><Platform /></el-icon>
            GitHub
          </a>
        </div>
      </div>
    </div>
    <div class="copyright">
      {{ new Date().getFullYear() }} Nav. Made with ❤️
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Platform } from '@element-plus/icons-vue'
</script>

<style scoped lang="scss">
.footer {
  margin: 3.75rem 1.5rem 1.5rem;
  padding: 2.5rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 0.125rem 0.75rem rgba(0, 0, 0, 0.04);

  .footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(17.5rem, 1fr));
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
    border-top: 0.0625rem solid #eee;
  }
}
</style>
