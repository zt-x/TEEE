<template>
  <!-- background-color: aqua; -->

  <v-app style="background: #f4f5fc">
    <!-- <SideBar :key="new Date().getTime() + 1" v-if="nb" /> -->
    <SideBar :key="new Date().getTime() + 1" v-if="nb" />
    <Navbar :role="user.role" :_avatar="user.avatar" />
    <v-snackbar
      v-model="snackbar"
      style="margin-top: 64px"
      top
      right
      color="success"
      dense="true"
      timeout="11 00"
    >
      欢迎回来，{{ user.username }}
    </v-snackbar>

    <v-main style="min-width: 1550px; padding: 64px; overflow: auto" id="main">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import SideBar from "@/components/SideBar.vue";
import Navbar from "@/components/Navbar.vue";
import { mapState } from "vuex";
import { resetRouter, setRouter } from "@/router";
import axios from "axios";

export default {
  name: "Home",

  components: {
    SideBar,
    Navbar,
  },
  data() {
    return {
      token: "",
      snackbar: false,
      user: {
        uid: 0,
        username: "",
        avatar: "",
      },
      nb: false,
      sb: false,
    };
  },

  computed: mapState(["userInfo"]),
  created() {
    let _this = this;
    //配置路由
    resetRouter();
    let token = window.localStorage.getItem("token");
    const _axios = axios.create();
    _axios.interceptors.request.use(function (config) {
      config.headers = {
        Authorization: token,
      };
      return config;
    });

    // 初始化用户信息
    _axios.post("/api/power").then((res) => {
      let data_ = res.data;
      _this.$store.commit(
        "updateUserInfo",
        JSON.stringify({
          username: data_.data.username,
          role: data_.data.role,
          avatar: data_.data.avatar,
        })
      );
      // sessionStorage.setItem('userInfo')
      let routers = eval("(" + data_.data.routers + ")");
		sessionStorage.setItem("serverRoutes", JSON.stringify(routers));
		console.log(routers);
      setRouter(routers);
      let u = JSON.parse(this.userInfo);
      _this.user.username = u.username;
      _this.user.avatar = u.avatar;
      _this.user.role = u.role;
      _this.snackbar = true;
      _this.nb = true;
      _this.sb = true;
    });
  },
};
</script>

<style>
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 7px;
  height: 7px;
  background-color: #f5f5f5;
}
/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  background-color: #a36645;
}
</style>
