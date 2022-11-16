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
                <v-icon color="white" x-small left>fa fa-paper-plane</v-icon>
                <span style="color: white">发布新作业 / 考试</span>
              </v-chip>

              <v-chip label color="#b97a57" class="ml-5">
                <v-icon color="white" x-small left>mdi-clipboard-outline</v-icon>
                <span style="color: white">发布公告</span>
              </v-chip>
              <v-chip
                @click="
                  flushContent();
                  getCourseInfo();
                "
                label
                color="#626262"
                class="ml-5"
              >
                <v-icon color="white" x-small left>fas fa-redo</v-icon>
                <span style="color: white">刷新</span>
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
                  <v-card color="basil" style="background: #f6f7f8" flat>
                    <WorksView
                      :cid="cid"
                      :works="works"
                      v-if="loading_workview && !isTeacher"
                    />
                    <WorksViewTeacher
                      :cid="cid"
                      :works="works"
                      v-if="loading_workview && isTeacher"
                    />
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card color="basil" style="background: #f6f7f8" flat>
                    <ExamsView
                      :cid="cid"
                      :exams="exams"
                      v-if="loading_examview && !isTeacher"
                    />
                    <ExamsViewTeacher
                      :cid="cid"
                      :exams="exams"
                      v-if="loading_examview && isTeacher"
                    />
                  </v-card>
                </v-tab-item>
                <v-tab-item v-if="isTeacher">
                  <v-card color="basil" style="background: #f6f7f8" flat>
                    <Announcement
                      :announcement="announcement"
                      v-if="loading_announcementview"
                    />
                  </v-card>
                </v-tab-item>
                <v-tab-item v-if="isTeacher">
                  <v-card
                    v-if="finishGetUser"
                    class="py-5"
                    color="basil"
                    style="background: #f6f7f8"
                    flat
                  >
                    <v-card
                      class="mx-auto"
                      width="95%"
                      rounded="true"
                      style="background: #a36645"
                    >
                      <v-container>
                        <v-row>
                          <v-col cols="4"> </v-col>
                          <v-col cols="4">
                            <div>
                              <v-text-field
                                append-icon="fas fa-search"
                                @click:append="searchUser"
                                @keypress.enter="searchUser"
                                dense
                                label="all"
                                hide-details="auto"
                                v-model="search_user"
                                solo
                              ></v-text-field>
                            </div>
                          </v-col>
                          <v-col cols="4">
                            <v-btn dark color="#a36645">
                              <v-icon>fas fa-plus</v-icon>
                              添加用户
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card>

                    <v-card
                      class="mx-auto mb-5"
                      width="95%"
                      rounded="false"
                      style="padding: 10px; background: #f6f7f8; overflow-y: auto"
                      v-if="finishGetUser"
                      max-height="500px"
                    >
                      <v-card class="my-1 mx-auto" style="width: 95%">
                        <v-container>
                          <v-row justify="center">
                            <v-col cols="2" class="hideMore"> 姓名 </v-col>
                            <v-col cols="2">学号</v-col>
                            <v-col cols="6">
                              <v-spacer></v-spacer>
                            </v-col>
                            <v-col cols="2"> 作业平均分 </v-col>
                          </v-row>
                        </v-container>
                      </v-card>
                      <v-card
                        v-for="user in userinfos_show"
                        :key="user.uid"
                        ripple
                        hover
                        class="my-1 mx-auto"
                        style="width: 94%"
                      >
                        <v-container>
                          <v-row>
                            <v-col cols="2" class="hideMore">
                              <v-avatar class="mr-1" size="30px">
                                <v-img :src="user.avatar"></v-img>
                              </v-avatar>
                              {{ user.username }}
                            </v-col>
                            <v-col cols="2">{{ user.uid }}</v-col>
                            <v-col cols="6">
                              <v-spacer></v-spacer>
                            </v-col>
                            <v-col cols="2">
                              <v-chip small>{{
                                user.workAverageScore.toFixed(1)
                              }}</v-chip>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card>
                    </v-card>
                  </v-card>
                  <v-card
                    v-if="!finishGetUser"
                    class="py-5"
                    color="basil"
                    style="background: #f6f7f8"
                    flat
                  >
                    <v-container>
                      <v-row class="text-center">
                        <v-col cols="12">
                          <v-progress-circular
                            indeterminate
                            :size="20"
                            color="primary"
                          ></v-progress-circular>
                          <span class="pl-2">正在获取成员信息并统计作业情况 ...</span>
                        </v-col>
                      </v-row>
                    </v-container>
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
          <v-card-title>{{ CourseInfo.CourseName }}</v-card-title>
          <v-card-subtitle
            >CourseKey:{{ this.cid }} || {{ CourseInfo.CourseTime }}</v-card-subtitle
          >
          <v-divider class="mb-5"></v-divider>
          <v-container>
            <v-row>
              <v-col cols="5">
                <v-card class="pl-5 pt-6" style="height: 200px">
                  <span>任课教师：{{ CourseInfo.TeacherName }}</span>
                  <v-divider></v-divider>

                  <span>班级人数: {{ CourseInfo.UserCount }}</span>
                  <v-divider></v-divider>

                  <span
                    >作业次数:
                    {{ CourseInfo.WorkCount == null ? 0 : CourseInfo.WorkCount }}</span
                  >
                  <v-divider></v-divider>
                  <span
                    >考试次数:
                    {{ CourseInfo.ExamsCount == null ? 0 : CourseInfo.ExamsCount }}</span
                  >
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
    <v-overlay v-if="loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <div class="mx-auto">{{ loadingText }}</div>
    </v-overlay>
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
import WorksViewTeacher from "@/components/CourseContentChildren/worksViewTeacher.vue";
import ExamsViewTeacher from "@/components/CourseContentChildren/examsViewTeacher.vue";

let token = window.localStorage.getItem("token");
const _axios = axios.create();

export default {
  components: {
    ExamsView,
    Announcement,
    WorksView,
    ReleaseWork,
    Chart_sex,
    Chart_workScroe,
    WorksViewTeacher,
    ExamsViewTeacher,
  },
  data() {
    return {
      tab: null,
      items: ["作业", "考试", "公告", "成员"],
      cid: 0,
      loading_workview: false,
      loading_examview: false,
      loading_announcementview: false,
      works: [],
      exams: [],
      announcement: [],
      isTeacher: false,
      releaseWorkDialog: false,
      loading: false,
      loadingText: "",
      searchIcon: "fa fa-user",
      userinfos: [],
      userinfos_show: [],
      finishGetUser: false,
      CourseInfo: {},
      search_user: "",
    };
  },
  methods: {
    searchUser() {
      let str = `\S*${this.search_user}\S*`;
      let reg = new RegExp(str);

      this.userinfos_show = [];
      this.userinfos_show = this.userinfos.filter((item) => {
        return reg.test(item.username) || reg.test(item.uid);
      });
    },
    async close() {
      this.releaseWorkDialog = false;
      this.flushContent();
      this.getCourseInfo();
    },
    getCourseInfo() {
      let _this = this;
      const form = new FormData();
      form.append("cid", this.cid);
      _axios
        .post("/api/Course/getCourseInfo", form)
        .then((res) => {
          _this.CourseInfo = eval(res.data.data);
        })
        .catch((err) => {
          alert("获取课程INFO失败：" + err);
        });
    },
    flushContent() {
      let _this = this;
      _axios
        .get("/api/power")
        .then((res) => {
          let role_data = res.data;
          if (role_data.code == 2) {
            _this.isTeacher = role_data.data == "teacher" ? 1 : 0;
            if (_this.isTeacher) {
              _this.items = ["作业", "考试", "公告", "成员"];
            } else {
              _this.items = ["作业", "考试"];
            }
            this.loadingText = "正在获取班级成员 .. ";
            const form1 = new FormData();
            form1.append("cid", this.cid);
            _axios
              .post("/api/Course/getAllUser", form1)
              .then((res) => {
                let arr = eval(res.data.data);
                arr = arr.sort((a, b) => {
                  return Number(b.workAverageScore) - Number(a.workAverageScore);
                });
                arr.forEach((element, i) => {
                  _this.userinfos[i] = element;
                  _this.userinfos_show[i] = element;
                });
                _this.finishGetUser = true;
                _this.loading = false;
              })
              .catch((err) => {
                alert("出问题咯，获取班级成员异常: " + err);
                _this.loading = false;
                _this.$router.replace({ path: "/Course" });
              });
          } else {
            alert("出问题咯，获取角色失败");
            _this.loading = false;
            _this.$router.replace({ path: "/login" });
          }
        })
        .catch((err) => {
          alert("出问题咯，获取角色请求失败" + err);
          _this.loading = false;
          _this.$router.replace({ path: "/login" });
        });
      const form = new FormData();
      form.append("cid", this.cid);
      _axios
        .post("/api/Course/getAllWorksByCID", form)
        .then((res) => {
          let dt = res.data.data;
          _this.works = dt.filter((item) => {
            return item.isExam == 0;
          });
          _this.exams = dt.filter((item) => {
            return item.isExam == 1;
          });
          _this.loading_announcementview = true;
          _this.loading_workview = true;
          _this.loading_examview = true;
          _this.$vuetify.goTo(0);
          _this.loading = false;
        })
        .catch((err) => {
          _this.$router.replace({ path: "/Course" });
          _this.loading = false;
        });
    },
  },
  mounted() {
    this.finishGetUser = false;
    this.loadingText = "正在获取作业 ...";
    this.loading = true;
    this.cid = this.$route.params.cid;
    if (this.cid == undefined) {
      this.cid = sessionStorage.getItem("temp_cid");
    } else {
      sessionStorage.setItem("temp_cid", this.cid);
    }
    let _this = this;
    token = window.localStorage.getItem("token");
    _axios.interceptors.request.use(function (config) {
      config.headers = {
        Authorization: token,
      };
      return config;
    });
    this.loadingText = "正在准备权限信息 .. ";
    this.$store.commit("updatePageName", "我的课程 / " + this.cid);
    this.flushContent();
    this.getCourseInfo();
  },
  created() {
    // this.isTeacher
  },
};
</script>

<style>
.hideMore {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
