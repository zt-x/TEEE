<template>
  <v-app-bar color="white" app dark flat>
    <h4 class="black--text ml-3">My Courses</h4>
    <v-spacer></v-spacer>
    <h4 class="brown--text text--lighten">User info</h4>
    <v-icon x-small color="red" class="ml-2 mr-2">fas fa-caret-down</v-icon>
    <v-btn color="#a36645" class="withoutupercase" @click.stop="openCourseDialog()">
      <v-icon left>fas fa-plus</v-icon>Add Course
    </v-btn>

    <!-- 加入课程 -->
    <v-dialog v-model="dialog_stu" max-width="290">
      <v-card>
        <v-card-title style="font-size: medium">请输入课程邀请码</v-card-title>
        <v-card-subtitle>
          <v-text-field
            v-model="CourseKey"
            style="font-size: small"
            class="mt-5"
            label="课程ID"
            hint="请输入教师提供的课程ID"
          ></v-text-field>
        </v-card-subtitle>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="brown darken-1" text @click="AddCourse(CourseKey)">
            确定加入
          </v-btn>
          <v-btn color="brown darken-1" text @click="dialog_stu = false"> 取消 </v-btn>
        </v-card-actions>
        <v-overlay v-if="loading">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <div class="mx-auto">{{ loadingText }}</div>
        </v-overlay>
      </v-card>
    </v-dialog>

    <!-- 创建新课程 -->
    <v-dialog v-model="dialog_tea" max-width="500">
      <v-card>
        <v-card-title style="font-size: medium">创建新课程</v-card-title>
        <v-card-subtitle>
          <v-form ref="form" v-model="form_vaild">
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    clearable
                    style="font-size: small"
                    v-model="form_courename"
                    :rules="form_courename_Rules"
                    color="brown"
                    label="课程名称"
                    hint="例如: 高等数学-2002班"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    clearable
                    style="font-size: small"
                    color="brown"
                    v-model="form_college"
                    label="专业"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    clearable
                    style="font-size: small"
                    v-model="form_banner"
                    color="brown"
                    label="课程封面图片URL"
                    hint="可留空。例如: http://xxx.xxx.png"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-img :src="form_banner" style="width: 239px; height: 101px"></v-img>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-menu
                    ref="startMenu"
                    style="font-size: small"
                    v-model="startMenu"
                    :close-on-content-click="true"
                    transition="scale-transition"
                    min-width="290px"
                    offset-y
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="form_startTime"
                        class="mt-3"
                        label="开课时间"
                        dense
                        style="font-size: small"
                        readonly
                        outlined
                        hide-details
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="form_startTime" no-title scrollable>
                      <v-spacer></v-spacer>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-menu
                    ref="endMenu"
                    v-model="endMenu"
                    :close-on-content-click="true"
                    transition="scale-transition"
                    min-width="290px"
                    offset-y
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="form_endTime"
                        style="font-size: small"
                        class="mt-3"
                        label="结课时间"
                        dense
                        readonly
                        outlined
                        hide-details
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="form_endTime" no-title scrollable>
                      <v-spacer></v-spacer>
                    </v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-subtitle>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="brown darken-1" text @click="createCourse()"> 创建 </v-btn>
          <v-btn color="brown darken-1" text @click="dialog_tea = false"> 取消 </v-btn>
        </v-card-actions>
        <v-overlay v-if="loading">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <div class="mx-auto">{{ loadingText }}</div>
        </v-overlay>
      </v-card>
    </v-dialog>
    <v-badge dot overlap color="green" class="ml-3 mr-2" dark>
      <v-avatar color="#ffe9b3">
        <v-icon color="#875438">fas fa-bell</v-icon>
      </v-avatar>
    </v-badge>
    <v-avatar color="#e5f1ff" :key="new Date().getTime()">
      <v-img :src="_avatar" width="40px"></v-img>
    </v-avatar>
    <v-snackbar
      v-model="snackbar"
      top
      :color="snackbar_color"
      dense="true"
      timeout="2000"
    >
      {{ msg }}
    </v-snackbar>
  </v-app-bar>
</template>

<script>
import axios from "axios";
const _axios = axios.create();
const token = window.localStorage.getItem("token");

export default {
  props: ["role", "_avatar"],
  data: () => ({
    dialog_stu: false,
    dialog_tea: false,
    CourseKey: "",
    loading: false,
    loadingText: "",
    snackbar: false,
    snackbar_color: "success",
    startMenu: false,
    endMenu: false,
    msg: "",
    form_vaild: false,
    // form_createCourse
    form_courename: "",
    form_courename_Rules: [(v) => !!v || "必须课程名输入哦"],
    form_college: "",
    form_banner: "",
    form_startTime: "",
    form_endTime: "",
  }),
  methods: {
    AddCourse() {
      this.loadingText = "Loading ...";
      this.loading = true;
      let _this = this;
      if (this.CourseKey.length > 0) {
        const form = new FormData();
        form.append("cid", this.CourseKey);
        _axios
          .post("/api/Course/addCourse", form)
          .then((res) => {
            _this.msg = res.data.msg;
            if (res.data.code == 2) {
              _this.snackbar_color = "success";
            } else {
              _this.snackbar_color = "error";
            }
            _this.loading = false;
            _this.dialog_stu = false;
            _this.snackbar = true;
            _this.$router.replace({ path: "/Flush", params: { path: "/Course" } });
          })
          .catch((err) => {
            _this.msg = "ERR: " + err;
            _this.snackbar_color = "error";
            _this.loading = false;
            _this.snackbar = true;
            _this.dialog_stu = false;
            _this.$router.replace({ path: "/Flush", params: { path: "/Course" } });
          });
      } else {
        _this.loading = false;
        _this.snackbar_color = "warning";
        _this.msg = "请输入Course Key";
        _this.snackbar = true;
      }
    },
    openCourseDialog() {
      if (this.role === "teacher") {
        this.dialog_tea = true;
      } else if (this.role === "student") {
        this.dialog_stu = true;
      } else if (this.role === "admin") {
        alert("You are admin");
      } else {
        alert("未知身份错误" + this.role);
        this.$router.replace("/login");
      }
    },
    createCourse() {
      let _this = this;
      let bool = this.$refs.form.validate();
      if (!bool) {
        return;
      } else {
        let d = {
          courseName: _this.form_courename,
          college: _this.form_college,
          banner: _this.form_banner,
          startTime: _this.form_startTime,
          endTime: _this.form_endTime,
        };
        _axios.post("/api/Course/createCourse", d).then((res) => {
          let _res = res.data;
          if (_res.code == 2) {
            _this.snackbar_color = "success";
          } else {
            _this.snackbar_color = "error";
          }
          _this.dialog_tea = false;
          _this.msg = _res.msg;
          _this.snackbar = true;
        });
      }
    },
  },
  created() {
    _axios.interceptors.request.use(function (config) {
      config.headers = {
        Authorization: token,
      };
      return config;
    });
  },
};
</script>

<style>
.v-btn.withoutupercase {
  text-transform: none !important;
}
</style>
