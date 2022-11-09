<template>
  <v-container fluid>
    <v-row>
      <!-- Submitted WorkPlace -->
      <v-col cols="12" sm="8">
        <v-card>
          <v-tabs v-model="tab" background-color="transparent" color="basil">
            <v-tab>
              <v-chip color="warning" small>111</v-chip>
              <span class="pl-2">未批改</span>
            </v-tab>
            <v-tab>
              <v-chip small color="success">12</v-chip>
              <span class="pl-2">已批改</span>
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card color="basil" flat class="pt-3">
                <SubmitWork v-for="(submit, index) in submits" :key="index" :SUBMIT="submit" />
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="basil" flat> </v-card>
            </v-tab-item>
          </v-tabs-items>
		  <div style="height:10px"></div>
        </v-card>
      </v-col>
      <!-- Statistic -->
      <v-col cols="12" sm="4">
        <v-card>
          <v-card-title>111</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SubmitWork from "@/components/CourseContentChildren/work/submitWork.vue";
import axios from "axios";
const _axios = axios.create();
let token = window.localStorage.getItem("token");
export default {
	
  components: { SubmitWork },
  data() {
    return {
      tab: null,
      items: ["未批改", "已批改"],
      submits: [
        { name: "xzt", username: "2020", score: 99 },
        { name: "xzt", username: "2020", score: 99 },
        { name: "xzt", username: "2020", score: 99 },
      ],
    };
},
	methods: {
		async getAllSubmits() {
			token = window.localStorage.getItem("token");
			let _this = this;
			// init axios
			_axios.interceptors.request.use(function (config) {
				config.headers = {
				Authorization: token,
				};
				return config;
			});
			const form = new FormData();
			form.append("wid", this.wid);
			_axios
				.post("/api/Work/getWork", form)
				.then((res) => {
				let questions = res.data.data;
				_this.qs = eval(questions);
				_this.myAnss.length = _this.qs.length;
				})
				.catch((err) => {});
		},
	},
	mounted() {

	}
   
};
</script>

<style></style>
