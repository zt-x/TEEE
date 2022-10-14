<template>
	<!-- background-color: aqua; -->
  <v-app style="background: #f4f5fc; ">
	<SideBar/>
	<Navbar/>
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
