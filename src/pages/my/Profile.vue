<template>
  <view>
    <view v-if="ifLogin">
      <view class="container">
        <view class="roulette-container">
          <view class="roulette"> 点击上传头像 </view>
        </view>
      </view>
      <view style="margin-left:'20px'"> 
        <view class="title">用户名:{{ username }}</view> 
        <view class="title">姓名:{{ realname }}</view> 
        <view class="title">默认分组:{{ groupName }} 
        <!-- <a href=""> <button type="primary">选择分组</button> </a> -->
        </view> 
      </view>
    </view>
    <scroll-view class="page" v-if="!ifLogin">
      <!-- #endif -->
      <form @submit="onFormSubmit" @reset="onFormReset">
        <view class="uni-form-item">
          <view class="title">用户名</view>
          <input
            class="uni-input"
            name="username"
            :value="username"
            placeholder="请输入用户名"
          />
        </view>
        <view class="uni-form-item">
          <view class="title">密码</view>
          <input
            class="uni-input uni-input-password"
            type="password"
            name="password"
            :value="password"
            placeholder="请输入密码"
          />
        </view>
        <template v-if="this.loginOrRegister === 'register'">
        <view class="uni-form-item">
          <view class="title">姓名</view>
          <input
            class="uni-input"
            name="realname"
            :value="realname"
            placeholder="请输入姓名"
          />
        </view>
        <view class="uni-form-item">
          <view class="title">邀请码</view>
          <input
            class="uni-input"
            name="iniCode"
            :value="iniCode"
            placeholder="请输入邀请码"
          />
        </view>
      </template>

        <view class="uni-btn-v flex-row">
          <button class="btn btn-submit" form-type="submit" type="primary"  v-if="this.loginOrRegister === 'login'">点击登陆</button>
          <button class="btn btn-submit" form-type="submit" type="primary"  v-else-if="this.loginOrRegister === 'register'">点击注册</button>
        </view>
        <a  v-if="this.loginOrRegister === 'login'"  @click="switchToRegister">点击注册</a>
        <a  v-else-if="this.loginOrRegister === 'register'"  @click="switchToLogin">返回登陆</a>
      </form>
      
    </scroll-view>
  </view>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      realname: "",
      groupName: "",
      password: "",
      iniCode: "",
      gender: "0",
      age: 18,
      loves: ["0"],
      switch: true,
      formData: {},
      ifLogin: false,
      loginOrRegister: 'login'
    };
  },
  created(){
    this.checkoutLogin();
  },
  computed: {
    formDataText() {
      return JSON.stringify(this.formData);
    },
  },
  methods: {
    switchToRegister() {
      // 当用户点击链接时，切换到注册状态
      this.loginOrRegister = 'register';
    },
    switchToLogin() {
      // 当用户点击链接时，切换回登录状态
      this.loginOrRegister = 'login';
    },
    checkoutLogin() {
      axios.get("/api/account/checkLogin").then(res => {
          if(res.data.data === null){
            this.ifLogin = false
          }else{
            this.initData(res.data.data)
            this.ifLogin = true
          }
      })
    },
    initData(res){
        this.username = res.username
        this.realname = res.realname
        this.groupName = res.groupName
    },
    onFormSubmit: function (e) {
      if(this.loginOrRegister === 'login'){
        this.login(e)
      }else{
        this.register(e)
      }
    },
    register(e){
      axios
        .post("/api/account/register", {
          username: e.detail.value.username,
          password: e.detail.value.password,
          iniCode: e.detail.value.iniCode,
          realname: e.detail.value.realname
        })
        .then((response) => {
          if(response.data.code === 200){
            alert("注册成功");
            this.switchToLogin();
          }else {
            var char = "注册失败:" + response.data.message;
            alert(char);
          }
        })
        .catch((error) => {
          var char = "注册失败:" + error.response.data.message;
          alert(char);
        });
    },
    login(e){
      axios
        .post("/api/account/login", {
          username: e.detail.value.username,
          password: e.detail.value.password,
        })
        .then((response) => {
          console.log(response)
          if(response.data.code === 200){
            alert("登陆成功");
            this.initData(response.data.data)
            this.ifLogin = true
          }else {
            var char = "登陆失败:" + response.data.message;
            alert(char);
          }
        })
        .catch((error) => {
          var char = "登陆失败:" + error.response.data.message;

          alert(char);
        });
    },
    onFormReset: function (_) {
      this.formData = {};
    },
  },
};
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
.page {
  flex: 1;
  padding: 15px;
}

.flex-row {
  flex-direction: row;
}

.uni-form-item {
  padding: 15px 0;
}

.title {
  margin-bottom: 10px;
}

.group-item {
  flex-direction: row;
  margin-right: 20px;
}

.btn {
  flex: 1;
}

.btn-submit {
  margin-right: 55px;
    width: 80%;
}

.btn-reset {
  margin-left: 5px;
}

.result {
  margin-top: 30px;
}

.textarea {
  margin-top: 5px;
  background-color: #fff;
}
</style>
