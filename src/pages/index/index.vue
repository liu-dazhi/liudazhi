<template>
  <view class="app-container">
    <!-- Main content area -->
    <view class="content">
      <!-- Content section -->
      <component :is="currentTabComponent"></component>
    </view>
    <!-- Bottom tab bar -->
<view class="tab-bar">
  <view
    class="tab-item"
    :class="{ active: currentTab === '首页' }"
    @click="currentTab = '首页'"
  >
    <box-icon color="currentColor" name='home-heart'></box-icon>
    <text class="tab-text">首页</text>
  </view>
  <view
    class="tab-item"
    :class="{ active: currentTab === '待定' }"
    @click="currentTab = '待定'"
  >
    <box-icon name='add-to-queue' color="currentColor"></box-icon>
    <text class="tab-text">选项</text>
  </view>
  <view
    class="tab-item"
    :class="{ active: currentTab === '我的' }"
    @click="currentTab = '我的'"
  >
    <box-icon name='user' color="currentColor"></box-icon>
    <text class="tab-text">我的</text>
  </view>
</view>
</view>
</template>
<script>
import Home from '../home/Home.vue';
import Pending from '../padding/Pending.vue';
import Profile from '../my/Profile.vue';

export default {
  components: {
    Home,
    Pending,
    Profile,
  },
  data() {
    return {
      currentTab: '首页',
     
    };
  },
  computed: {
    currentTabComponent() {
      if (this.currentTab === '首页') {
        return 'Home';
      } else if (this.currentTab === '待定') {
        return 'Pending';
      } else if (this.currentTab === '我的') {
        return 'Profile';
      }
    },
  },
};
</script>
<style>
  .app-container {
    position: relative;
    height: 100vh;
    background-color: #DFE4EF; /* 设置背景色 */
  }

  .content {
    padding-bottom: 50px; /* 为选项卡栏预留空间 */
  }

  .tab-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0px;
    background-color: #f0f0f0;
  }

  .tab-item {
    flex: 1;
    text-align: center;
    padding: 10px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .tab-item.active {
    background-color: #e0e0e0;
    color: #fff;
  }

  .tab-text {
    font-size: 12px;
  }
</style>