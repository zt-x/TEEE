<template>
  <v-container>
    <v-card v-for="work in works" v-bind:key="work.id" style="min-width: 100%" hover>
      <v-card-title>
        {{work.workName}}
        <v-spacer></v-spacer>
        <v-chip small class="ma-2" color="green" text-color="white"> 已完成 </v-chip>
      </v-card-title>
      <v-card-subtitle>123</v-card-subtitle>
    </v-card>

  </v-container>
</template>

<script>
import axios from "axios";
let token = window.localStorage.getItem("token");

export default {
  props: ["cid"],
  data() {
	  return {
		  works: [
			{
				"id": 2,
				"isExam": 0,
				"deadline": "veniam ipsum consectetur",
				"workName": "低至响",
				"totalScore": 56.0,
				"workId": 68,
				"cid": 25
			}
		]
	};
	},
	created() {
		const _axios = axios.create();
		token = window.localStorage.getItem("token");
		_axios.interceptors.request.use(function (config) {
		config.headers = {
			Authorization: token,
		};
		return config;
		});
		const form = new FormData();
		form.append("cid", this.cid);
		_axios.post("/api/Course/getAllWorksByCID", form).then((res) => {
			console.log(res.data.data);
			this.works = res.data.data;
		});
    }
};
</script>

<style></style>
