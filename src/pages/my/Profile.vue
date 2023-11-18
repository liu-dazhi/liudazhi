<template>
  <view class="container">
    <view class="roulette-container">
      <view class="roulette">
        点击登陆/注册
      </view>
    </view>
    
  </view>
</template>

<script>
export default {
  // Add component logic here
}
</script>
<style scope>
.roulette {
  width: 150px;
  height: 150px;
  border: 1px solid #ccc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: bold;
  color: #333;
  background-color: #f0f0f0;
  transition: transform 0.2s ease-in-out;
}
.roulette-container {
  position: relative;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 40vh;
}

</style>