<template>
	<v-card max-height="800px" style="overflow-y: auto;overflow-x: hidden;">
		<v-row>
			
			<v-card-title class="mx-auto">
				<!-- <i class="fa fa-list-ul" aria-hidden="true"></i> -->
				<v-icon left small color="black">fa fa-calendar-check</v-icon>
				 Todo List</v-card-title>
		</v-row>
		<!-- <div class="mx-auto" style="width:80%;text-align: center;">-----</div> -->
		<v-divider></v-divider>
		<!-- <v-row></v-row> -->
		<div class="mx-auto mt-5" style="width:100%;">
			<!-- <v-subheader>
				<v-icon
					left
					small
					color="red"
				>
					fa fa-pencil
				</v-icon>
				考试</v-subheader> -->
			<TodoListItem v-for="(item, i) in TodoDatas" v-bind:key="i" :TodoData="TodoDatas[i]"/>
		</div>

	</v-card>
</template>

<script>
import TodoListItem from './TodoListItem.vue';
export default {
	components: { TodoListItem },
	data: () => ({
		TodoDatas: [
			{
				CourseName: '软件工程',
				Exams: [
					{ examName: '期中测试', examID: '0', deadline:'2022-07-31'},
					{examName:'期末测试',examID:'1', deadline:'2022-07-31'},
					{examName:'长文本测试试试试试试试试试试试试试试试试试试试试',examID:'1', deadline:'2022-07-31'},
				],
				Work: [
					{ workName: 'UML图设', workID:'0'}
				]
			},
			{
				CourseName: '数据库',
				Exams: [
					{examName:'期中测试',examID:'0'}
				],
				Work: [
					{ workName: '数据库设计', workID:'0'}
				]
			},
			{
				CourseName: '软件工程',
				Exams: [
					{ examName: '期中测试', examID: '0', deadline:'2022-07-31'},
					{examName:'期末测试',examID:'1', deadline:'2022-07-31'},
					{examName:'长文本测试试试试试试试试试试试试试试试试试试试试',examID:'1', deadline:'2022-07-31'},
				],
				Work: [
					{ workName: 'UML图设', workID:'0'}
				]
			},
			{
				CourseName: '软件工程',
				Exams: [
					{ examName: '期中测试', examID: '0', deadline:'2022-07-31'},
					{examName:'期末测试',examID:'1', deadline:'2022-07-31'},
					{examName:'长文本测试试试试试试试试试试试试试试试试试试试试',examID:'1', deadline:'2022-07-31'},
				],
				Work: [
					{ workName: 'UML图设', workID:'0'}
				]
			},
			{
				CourseName: '软件工程',
				Exams: [
					{ examName: '期中测试', examID: '0', deadline:'2022-07-31'},
					{examName:'期末测试',examID:'1', deadline:'2022-07-31'},
					{examName:'长文本测试试试试试试试试试试试试试试试试试试试试',examID:'1', deadline:'2022-07-31'},
				],
				Work: [
					{ workName: 'UML图设', workID:'0'}
				]
			},
			{
				CourseName: '软件工程',
				Exams: [
					{ examName: '期中测试', examID: '0', deadline:'2022-07-31'},
					{examName:'期末测试',examID:'1', deadline:'2022-07-31'},
					{examName:'长文本测试试试试试试试试试试试试试试试试试试试试',examID:'1', deadline:'2022-07-31'},
				],
				Work: [
					{ workName: 'UML图设', workID:'0'}
				]
			},
		],
	})
}
</script>

<style>

</style>