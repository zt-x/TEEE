<template>
  <v-container fluid>
    <v-row>
      <!-- Course WorkPlace -->
      <v-col cols="12" sm="8">
        <v-card>
          <v-tabs v-model="tab" background-color="transparent" color="basil">
            <v-tab v-for="item in items" :key="item">
              {{ item }}
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item :key="items[0]">
              <v-card color="basil" flat>
                <WorksView :works="works" v-if="loading_workview"/>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="basil" flat>
                <ExamsView :exams="exams" v-if="loading_examview"/>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="basil" flat>
                <Announcement :announcement="announcement" v-if="loading_announcementview"/>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
      <!-- Course Info -->
      <v-col cols="12" sm="4">
        <v-card>
          <v-card-title>CourseName{{ this.cid }}</v-card-title>
          <v-card-subtitle>2022/ 09/ 01 - 20</v-card-subtitle>
          <v-card-text>TEXT1</v-card-text>
          <v-card-text>TEXT2</v-card-text>
          <v-card-text>TEXT3</v-card-text>
          <v-card-text>TEXT4</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Announcement from "@/components/CourseContentChildren/announcement.vue";
import ExamsView from "@/components/CourseContentChildren/examsView.vue";
import WorksView from "@/components/CourseContentChildren/worksView.vue";
import axios from "axios";
let token = window.localStorage.getItem("token");
export default {
  components: { ExamsView, Announcement, WorksView },
  data() {
    return {
      tab: null,
      items: ["作业", "考试", "公告"],
		cid: 0,
		loading_workview: false,
		loading_examview: false,
		loading_announcementview: false,
	  works: [],
	  exams: [],
	  announcements: [],
    };
  },
  created() {
	  this.cid = this.$route.params.cid;
	  const _axios = axios.create();
	  let _this = this;
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
			let dt = res.data.data;
			_this.works = dt.filter((item) => {
				return item.isExam == 0
			});
			_this.exams = dt.filter((item) => {
				return item.isExam == 1
			});
			_this.works = res.data.data;
			console.log(_this.works);
			_this.loading_announcementview = true;
			_this.loading_workview= true;
			_this.loading_examview = true;

		});
  },
};
</script>

<style></style>
