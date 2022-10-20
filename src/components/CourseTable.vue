<template>
  <v-card>
	<v-card-title class="overline" style="justify-content:center">Today Courses</v-card-title>
	<v-card style="width:80%;" class="mx-auto mb-3"  ripple hover elevation="6" color="#385F73" dark v-for="(item, i) in TodoCourses" v-bind:key="i">
			<v-row dense>
				<v-col>
					<span style="font-size:10px;" class="spanStyle">{{item.courseName}}</span>	
				</v-col>
				<v-col>
					<span style="font-size:10px" class="spanStyle">{{item.coursePlace}}</span>	
				</v-col>
				<v-col>
					<span style="font-size:10px" class="spanStyle">{{item.courseTime}}</span>	
				</v-col>
			</v-row>
	</v-card>
	<div style="height:20px"></div>
  </v-card>
</template>

<script>
export default {
	data: () => ({
		TodoCourses: [
			{
				courseName: '科技文献调研与实验研究方法',
				coursePlace: 'BX-105',
				courseTime:'08:30'
			},
			{
				courseName: '汇编语言基础',
				coursePlace: 'BX-317',
				courseTime:'10:25'
			},
			{
				courseName: '汇编语言基础',
				coursePlace: 'BS-224',
				courseTime:'14:00'
			},
			{
				courseName: '软件测试',
				coursePlace: 'BX-303',
				courseTime: '15:55'
			},
		]
	})
}
</script>

<style scoped>
.spanStyle{  
      white-space: nowrap;  /*强制span不换行*/
      display: inline-block;  /*将span当做块级元素对待*/
      width: 90px;  /*限制宽度*/
      overflow: hidden; /* 超出宽度部分隐藏 */
      text-overflow: ellipsis;  /*超出部分以点号代替*/
      line-height: 1;  /*数字与之前的文字对齐*/
	  padding-left: 12px;
	  margin: 0;
	  /* background-color: aqua; */
}
</style>