<template>
  <v-container fluid>

    <v-dialog persistent v-model="releaseWorkDialog" width="800px">
      <release-work :cid="cid" @close="close($event)" />
    </v-dialog>
    <v-row>
      <!-- Course WorkPlace -->
      <v-col cols="12" sm="8">
        <v-row v-if="isTeacher">
          <v-col cols="12">
            <v-card rounded="true" style="padding: 10px">
              <v-chip label @click="releaseWorkDialog = true" color="#b97a57">
                <v-icon color="white" small left>fa fa-paper-plane</v-icon>
                <span style="color: white">发布新作业 / 考试</span>
              </v-chip>

              <v-chip label color="#b97a57" class="ml-5">
                <v-icon color="white" small left>mdi-clipboard-outline</v-icon>
                <span style="color: white">发布公告</span>
              </v-chip>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-tabs v-model="tab" background-color="transparent" color="basil">
                <v-tab v-for="item in items" :key="item">
                  {{ item }}
                </v-tab>
              </v-tabs>
              <v-tabs-items v-model="tab">
                <v-tab-item :key="items[0]">
                  <v-card color="basil" flat>
                    <WorksView :works="works" v-if="loading_workview" />
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card color="basil" flat>
                    <ExamsView :exams="exams" v-if="loading_examview" />
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card color="basil" flat>
                    <Announcement
                      :announcement="announcement"
                      v-if="loading_announcementview"
                    />
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <!-- Course Info -->
      <v-col cols="12" sm="4">
        <v-card>
          <v-card-title>CourseName{{ this.cid }}</v-card-title>
          <v-card-subtitle>2022/ 09/ 01 - 20</v-card-subtitle>
          <v-divider class="mb-5"></v-divider>
          <v-container>
            <v-row>
              <v-col cols="5">
                <v-card class="pl-5 pt-6" style="height: 200px">
                  <span>任课教师：许正韬</span>
                  <v-divider></v-divider>

                  <span>班级人数: 5人</span>
                  <v-divider></v-divider>

                  <span>作业次数: 12次</span>
                  <v-divider></v-divider>
                </v-card>
              </v-col>
              <v-col cols="7">
                <Chart_sex />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
        <v-card class="mt-5">
          <v-card-title>学情分析</v-card-title>
          <v-divider></v-divider>
          <v-container>
            <v-row>
              <v-col cols="12">
                <Chart_workScroe />
              </v-col>
            </v-row>
          </v-container>
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
import ReleaseWork from "@/components/CourseContentChildren/work/releaseWork.vue";
import Chart_sex from "@/components/CourseContentChildren/charts/chart_sex.vue";
import Chart_workScroe from "@/components/CourseContentChildren/charts/chart_workScroe.vue";

let token = window.localStorage.getItem("token");
export default {
  components: {
    ExamsView,
    Announcement,
    WorksView,
    ReleaseWork,
    Chart_sex,
    Chart_workScroe,
  },
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
      announcement: [],
      isTeacher: true,
      releaseWorkDialog: false,
    };
  },
  methods: {
    async close() {
      this.releaseWorkDialog = false;
    },
  },
  mounted() {},
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
        return item.isExam == 0;
      });
      _this.exams = dt.filter((item) => {
        return item.isExam == 1;
      });
      _this.works = res.data.data;
      _this.loading_announcementview = true;
      _this.loading_workview = true;
      _this.loading_examview = true;
      _this.$vuetify.goTo(0);
    });
  },
};
</script>

<style></style>
