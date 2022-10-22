<template>
  <v-app-bar color="white" app dark flat>
	<h4 class="black--text ml-3">My Courses</h4>
	<v-spacer></v-spacer>
	<h4 class="brown--text text--lighten">User info</h4>
	<v-icon x-small color="red" class="ml-2 mr-2">fas fa-caret-down</v-icon>
	<v-btn color="#a36645" class="withoutupercase" @click.stop="openCourseDialog()">
		<v-icon left>fas fa-plus</v-icon>Add Course
	</v-btn> 
	<v-dialog
      v-model="dialog_stu"
      max-width="290"
    >
		<v-card>
			<v-card-title style="font-size:medium">请输入课程邀请码</v-card-title>
			<v-card-subtitle>
				<input type="text" v-model="CourseKey" placeholder="Course Key"/>
			</v-card-subtitle>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn
					color="brown darken-1"
					text
					@click="AddCourse(CourseKey)"
				>
					确定加入
				</v-btn>
				<v-btn
					color="brown darken-1"
					text
					@click="dialog_stu=false"
				>
					取消
				</v-btn>
			</v-card-actions>
			<v-overlay
				v-if="loading"
			>
				<v-progress-circular
					indeterminate
					color="primary"
				></v-progress-circular>
				<div class="mx-auto">{{loadingText}}</div>
			</v-overlay>

		</v-card>
	</v-dialog>                                                                                                                                                                     
	<v-dialog
      v-model="dialog_tea"
      max-width="290"
    >
		<v-card>
			<v-card-title style="font-size:medium">创建新课程</v-card-title>
			<v-card-subtitle>
				<input type="text" v-model="CourseKey" placeholder="Course Key"/>
			</v-card-subtitle>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn
					color="brown darken-1"
					text
					@click="createCourse()"
				>
					创建
				</v-btn>
				<v-btn
					color="brown darken-1"
					text
					@click="dialog_tea=false"
				>
					取消
				</v-btn>
			</v-card-actions>
			<v-overlay
				v-if="loading"
			>
				<v-progress-circular
					indeterminate
					color="primary"
				></v-progress-circular>
				<div class="mx-auto">{{loadingText}}</div>
			</v-overlay>

		</v-card>
	</v-dialog>
	<v-badge dot overlap color="green" class="ml-3 mr-2" dark>
		<v-avatar color="#ffe9b3">
			<v-icon color="#875438">fas fa-bell</v-icon>
		</v-avatar>
	</v-badge>
	<v-avatar color="#e5f1ff" :key="new Date().getTime()">
		<v-img :src="_avatar" width="40px"></v-img>
	</v-avatar>
	<v-snackbar 
		v-model="snackbar"
		top
		:color="snackbar_color"
		dense="true"
		timeout="2000">
		{{msg}}
	</v-snackbar>
  </v-app-bar>
</template>

<script>
import axios from 'axios'
const _axios = axios.create();
const token = window.localStorage.getItem('token');

export default {
	props:['role', '_avatar'],
	data: () => ({
		dialog_stu: false,
		dialog_tea: false,
		CourseKey: '',
		loading: false,
		loadingText: '',
		snackbar: false,
		snackbar_color:'success',
		msg:''
	}),
	methods: {
		
		AddCourse() {
			this.loadingText = 'Loading ...'
			this.loading = true;
			let _this = this;
			if (this.CourseKey.length > 0) {
				const form = new FormData();
				form.append('cid', this.CourseKey);
				_axios.post('/api/Course/addCourse', form).then((res) => {
					_this.msg = res.data.msg;
					if (res.data.code == 2) {
						_this.snackbar_color = 'success';
					} else {
						_this.snackbar_color = 'error';	
					}
					_this.loading = false;
					_this.snackbar = true;
				}).catch((err) => {
					
				});
			} else {
				_this.loading = false;
				_this.snackbar_color = 'warning';
				_this.msg = "请输入Course Key";
				_this.snackbar = true;
			}

		},
		openCourseDialog() {
			if (this.role === 'teacher') {
				this.dialog_tea = true;
			} else if (this.role === 'student') {
				this.dialog_stu = true;
				
			} else if (this.role === 'admin') {
				alert('You are admin');
			} else {
				alert("未知身份错误" + this.role);
				this.$router.replace('/login');
			}
		},
		createCourse() {
			
		}
	},
	created() {
		_axios.interceptors.request.use(
			function (config) {
				config.headers = {
					Authorization: token
				}
				return config;
			}
		);
	}

}
</script>

<style>
.v-btn.withoutupercase{
	text-transform: none !important;
}
input{
	margin-top: 15px;
	font: inherit;
	font-size: 14px;
	width:100%;
	border: 0;
	outline: 0;
	line-height: 30px;
	/* border-radius: 10px; */
	padding-left: 20px;
	box-shadow: #a36645 0 5px 5px -1px;

}
input:hover{
	transition: all .5s;
	box-shadow: #a36645 0 3px 5px -1px;

}
input::placeholder{
	color: grey;
	font-size: inherit;
}
input:not(.submit){
	background-color: hsl(43, 36%, 86%);
}
</style>