<template>
  <v-app-bar color="white" app dark flat>
	<h4 class="black--text ml-3">这里是标题</h4>
	<v-spacer></v-spacer>
	<h4 class="brown--text text--lighten">User info</h4>
	<v-icon x-small color="red" class="ml-2 mr-2">fas fa-caret-down</v-icon>
	<v-btn color="#a36645" class="withoutupercase">
		<v-icon left>fas fa-plus</v-icon>add Patients
	</v-btn>                                                                                                                                                                      
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

}
</script>

<style>
.v-btn.withoutupercase{
	text-transform: none !important;
}
</style>