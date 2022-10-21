<template>
	<!-- background-color: aqua; -->
  <v-app style="background: #f4f5fc; background-color: aqua;">

	<SideBar :key="new Date().getTime()"/>
	<Navbar/>
	<v-snackbar
		v-model="snackbar"
		top
		color="brown"
		dense
		timeout="2000"
		>
		欢迎回来，{{user.username}}
	</v-snackbar>
	<v-main style="overflow:auto">
		<router-view></router-view>
	</v-main>
  </v-app>                 
</template>

<script>

import SideBar from '@/components/SideBar.vue';
import Navbar from '@/components/Navbar.vue';
import { mapState } from 'vuex';
import {resetRouter, setRouter} from '@/router'
import axios from 'axios'

export default {
	name: 'Home',

	components: {
		SideBar,
		Navbar
	},
	data() {
		return {
			token: '',
			snackbar: false,
			user: {
				uid: 0,
				username: '',
				avatar: '',
			},
		}
	},	
	computed: mapState([
		"userInfo"
	]),
	mounted() {


	},
	created() {
		let _this = this;
		//配置路由
		resetRouter();
		let token = window.localStorage.getItem('token');
		const _axios = axios.create();
		_axios.interceptors.request.use(
			function (config) {
				config.headers = {
					Authorization: token
				}
				return config;
			}
		);

		// 初始化用户信息
		_axios.post('/api/power').then((res) => {
			let data_ = res.data;
			console.log(data_);
			_this.$store.commit('updateUserInfo', JSON.stringify({username:data_.data.username, role:data_.data.role, avatar:data_.data.role}));
			let routers = eval('(' + data_.data.routers + ')');
			sessionStorage.setItem('serverRoutes', JSON.stringify(routers));
			setRouter(routers);
			console.log("userInfo:" + this.userInfo);
			let u = JSON.parse(this.userInfo);
			_this.user.username = u.username;
			_this.user.avatr = u.avatar;
			_this.snackbar = true;

		})
	} 
}

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
