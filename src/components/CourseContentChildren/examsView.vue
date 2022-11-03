<template>
	<v-container>
	  <div v-for="exam in exams" v-bind:key="exam.id">
		<v-card style="min-width: 100%" hover ripple="">
		  <v-card-title>
			{{ exam.workName }}
			<v-spacer></v-spacer>
			<v-chip small class="ma-2" color="green" text-color="white"> 已完成 </v-chip>
		  </v-card-title>
		  <v-card-subtitle>123</v-card-subtitle>
		</v-card>
		<div style="height: 5px"></div>
	  </div>
	</v-container>
  </template>
  
  <script>
  export default {
	props: ["exams"],
	data() {
	  return {};
	},
	created() {},
  };
  </script>
  
  <style scoped></style>
  