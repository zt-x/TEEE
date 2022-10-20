<template>
	<!-- background-color: aqua; -->
  <v-app style="background: #f4f5fc;">

	<SideBar/>
	<Navbar/>
	<v-snackbar
		v-model="snackbar"
		top
		color="brown"
		dense
		>
		欢迎回来, sb
	</v-snackbar>
	<v-main style="overflow:auto">
		<router-view></router-view>
	</v-main>
  </v-app>                 
</template>

<script>

import SideBar from '@/components/SideBar.vue';
import Navbar from '@/components/Navbar.vue';
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

		}
	},
	created() {
		JSON.parse(window.localStorage.getItem('token')).data
		
		setTimeout(() => {
			this.snackbar = true;
			setTimeout(() => {
				this.snackbar = false;
				
			}, 2000)
		},500)
	
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
