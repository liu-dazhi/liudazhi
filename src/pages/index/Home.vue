<template>
  <view class="container">
    <view class="roulette-container">
      <view class="roulette">
        {{ rouletteItems[displayIndex] }}
      </view>
    </view>
    <button class="start-btn" :disabled="spinning" @click="startRoulette">开始</button>
  </view>
</template>

<script>
import axios from 'axios';


export default {
  data() {
    return {
      rouletteItems: [], // 动态的转盘内容数组
      displayIndex: 0, // 当前显示的内容索引
      spinning: false, // 转盘是否正在变换
      intervalDuration: 100, // 变换间隔时间，单位为毫秒
    };
  },
  created() {
    // 在组件创建时查询数据库并赋值给rouletteItems数组
    this.fetchRouletteItems();

  },
  methods: {
    fetchRouletteItems() {
      axios.get('/api/getData')
        .then(response => {

          this.rouletteItems = response.data.data.map(item => item.name);
          console.log(this.rouletteItems)
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
    startRoulette() {
      if (this.spinning) return; // 防止重复点击

      this.fetchRouletteItems(); // 获取转盘的内容

      this.spinning = true;
      this.displayIndex = 0; // 重置索引

      // 启动定时器，每隔一定时间更新内容索引
      this.intervalId = setInterval(() => {
        this.displayIndex = Math.floor(Math.random() * this.rouletteItems.length);
      }, this.intervalDuration);

      // 2秒后停止定时器
      setTimeout(() => {
        this.stopRoulette();
      }, 2000);
    },
    stopRoulette() {
      this.spinning = false;
      // 停止定时器
      clearInterval(this.intervalId);
      // 在变换停止后，根据当前显示的内容索引来确定最终选中的内容
      this.selected = this.rouletteItems[this.displayIndex];
    
    },
  },
  beforeDestroy() {
    // 组件销毁前，确保停止定时器
    this.stopRoulette();
  },
};
</script>



<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.roulette-container {
  position: relative;
}

.roulette {
  width: 200px;
  height: 200px;
  border: 1px solid #ccc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: #333;
  background-color: #f0f0f0;
  transition: transform 0.2s ease-in-out;
}

.start-btn {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>