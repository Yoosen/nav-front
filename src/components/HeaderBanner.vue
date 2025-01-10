<template>
  <div class="header-banner">
    <div class="banner-content">
      <h1>Nav</h1>
      <p>一个简洁优雅的导航网站</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header-banner {
  height: 16.25rem; // 260px
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  margin: 1.5rem 1.5rem 3rem; // 24px 24px 48px
  border-radius: 0.75rem; // 12px
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
    padding: 0 1.25rem; // 20px

    h1 {
      font-size: 3rem; // 48px
      font-weight: 700;
      margin-bottom: 1rem; // 16px
      letter-spacing: 0.125rem; // 2px
    }

    p {
      font-size: 1.125rem; // 18px
      opacity: 0.9;
      max-width: 37.5rem; // 600px
    }
  }
}
</style>
