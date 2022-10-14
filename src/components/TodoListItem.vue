<template>
  <v-list>
	<!-- <v-divider></v-divider> -->
	<v-subheader v-text="TodoData.CourseName" style="color:#875438;font-weight:700"></v-subheader>
	<v-list-group no-action value="true">
		<template v-slot:activator>
			<v-list-item-subtitle><span style="color:#875438;	font-weight: 700;">★</span> 考试</v-list-item-subtitle>
		</template>
		<v-list-item v-for="(Exams) in TodoData.Exams" v-bind:key="Exams.examID" v-ripple="{class:'warning--text'}" class="item">
			<v-list-item-icon>
				<v-icon right small>fa fa-pencil</v-icon>
			</v-list-item-icon>
			<v-list-item-subtitle v-text="Exams.examName"></v-list-item-subtitle>
			<v-list-item-subtitle>
				截止时间: {{Exams.deadline}}
			</v-list-item-subtitle>
			<!-- <v-list-item-content>{{Exams.examName}}</v-list-item-content> -->
		</v-list-item>

	</v-list-group>
	<v-list-group>
		<template v-slot:activator>
			<v-list-item-subtitle><span style="color:#875438;	font-weight: 700;">⚑</span> 作业</v-list-item-subtitle>
		</template>
	</v-list-group>
  </v-list>
</template>

<script>
export default {
	props:['TodoData'],
	data: () => ({
		te:'text'
	}),
}
</script>

<style scoped>
.v-application--is-ltr .v-list-group--no-action > .v-list-group__items > .v-list-item {
	padding-left: 16px;
	cursor: pointer;
}
.item:hover{
	background-color: antiquewhite;
}
</style>