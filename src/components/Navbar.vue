<template>
  <v-app-bar color="white" app dark flat>
	<h4 class="black--text ml-3">My Courses</h4>
	<v-spacer></v-spacer>
	<h4 class="brown--text text--lighten">User info</h4>
	<v-icon x-small color="red" class="ml-2 mr-2">fas fa-caret-down</v-icon>
	<v-btn color="#a36645" class="withoutupercase" @click.stop="dialog = true">
		<v-icon left>fas fa-plus</v-icon>Add Course
	</v-btn> 
	<v-dialog
      v-model="dialog"
      max-width="290"
    >
		<v-card>
			<v-card-title style="font-size:medium">请输入课程邀请码</v-card-title>
			<v-card-subtitle>
				<input type="text" v-model="username" placeholder="Course Key"/>
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
					@click="dialog=false"
				>
					取消
				</v-btn>
			</v-card-actions>
			<v-overlay
				:absolute="absolute"
				:value="overlay"
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
		<v-avatar tile color="#ffe9b3">
			<v-icon color="#875438">fas fa-bell</v-icon>
		</v-avatar>
	</v-badge>
	<v-avatar tile color="#e5f1ff">
		<v-img src="dog.png" width="40px"></v-img>
	</v-avatar>
  </v-app-bar>
</template>

<script>
export default {
	data: () => ({
		dialog: false,
		CourseKey: '',
		loading: false,
		loadingText: '',
		snackbar: false,
		user: {
			uid:'',
			username:''
		}
	}),
	methods: {
		AddCourse(CourseKey) {
			this.loadingText = 'Loading ...'
			this.loading = true;
			setTimeout(() => {
				this.loading = false;
			},3000)
		}
	},

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