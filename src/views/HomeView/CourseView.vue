<template>
	<!-- <v-row>
		<v-col></v-col>
	</v-row> -->
	<!-- <Course  :CourseName="course.name" :CourseID="course.id"></Course> -->
	<v-container style="margin-left:0">
		<v-row style="min-width:980px">
			<v-col cols="12" sm="8">
				<v-row>
					<v-col v-for="(course, i) in courses" v-bind:key="i" cols="12" sm="4">
						<Course  :Course="course"></Course>
					</v-col>
				</v-row>

			</v-col>
			<v-col cols="12" sm="4">
				<CourseTable style="min-width:400px"/>
				<div style="height:20px"></div> 
				
				<TodoList style="min-width:400px"/>
			</v-col>

		</v-row>
	</v-container>

	<!-- <div style="background:red; width: 10000px;"> -->

		<!-- <v-row>
			<v-col cols="12" sm="8"></v-col>
			<v-col cols="12" sm="4"></v-col>
		</v-row> -->
		<!-- <Course  :CourseName="course.name" :CourseID="course.id"></Course> -->
	<!-- </div> -->
</template>

<script>
import Course from "../../components/Course.vue";
import TodoList from "@/components/TodoList.vue";
import CourseTable from "@/components/CourseTable.vue";
  export default {
    data: () => ({
		  courses: [
			{Name:'软件工程2002', id:0, TeacherName:'许正韬',College:'计算机科学与工程学院', Time:'2022/07/20 - 2023/07/21', IMG:'https://cdn.vuetifyjs.com/images/cards/docks.jpg'},
			{Name:'数据库2002', id:1, TeacherName:'鲁小东', College:'计算机科学与工程学院',Time:'2022/07/20 - 2023/07/21', IMG:'LOG2.jpg'},
			{Name:'软件工程2002', id:2, TeacherName:'许正韬', Time:'2022/07/20 - 2023/07/21'},
			{Name:'软件工程2002', id:3, TeacherName:'许正韬', Time:'2022/07/20 - 2023/07/21'},
			{Name:'软件工程2002', id:4, TeacherName:'许正韬', Time:'2022/07/20 - 2023/07/21'},
			// {Name:'软件工程2002', id:5, TeacherName:'许正韬', Time:'2022/07/20 - 2023/07/21'}
		]
    }),
    components: { Course, TodoList, CourseTable }
}
</script>

<style>
.course_img{
	display:flex;
	justify-content: center; 
	align-items:center;
}
.foot{
	height:50px;
}
</style>