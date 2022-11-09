<template>
	<v-container>
	  <div v-for="work in works" v-bind:key="work.id">
		<v-card
		  style="min-width: 100%"
		  hover
		  ripple=""
		  @click="enterSubmitsPage()"
		>
		  <v-card-title>
			{{ work.workName }}
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
	props: ["works", "cid"],
	data() {
	  return {};
	},
	created() { },
	methods: {
		enterSubmitsPage() {
			// this.$router.push({ name: 'doWork', params: { wid: work.id, wname: work.workName, cid: cid } });
		}
	}
  };
  </script>
  
  <style scoped></style>
  