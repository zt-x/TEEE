<template>
  <!-- <v-row>
		<v-col></v-col>
	</v-row> -->
  <!-- <Course  :CourseName="course.name" :CourseID="course.id"></Course> -->
  <v-container fluid>
    <v-overlay :value="prepareing_overlay">
      <v-chip>
        <v-progress-circular indeterminate size="16" class="mr-3"></v-progress-circular>
        <v-spacer></v-spacer>
        <span>正在准备内容 ...</span>
      </v-chip>

      <!-- <v-text>正在准备内容 ... </v-text> -->
    </v-overlay>
    <v-row style="min-width: 980px">
      <v-col cols="12" sm="8">
        <v-row>
          <v-col v-for="(course, i) in courses" v-bind:key="i" cols="12" sm="4">
            <Course :Course="course"></Course>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="4">
        <CourseTable style="min-width: 400px" />
        <div style="height: 20px"></div>

        <TodoList style="min-width: 400px" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Course from "../../components/Course.vue";
import TodoList from "@/components/TodoList.vue";
import CourseTable from "@/components/CourseTable.vue";
import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
const _axios = axios.create();
let token = window.localStorage.getItem("token");
export default {
  data: () => ({
    courses: [
      //   {
      //     Name: "软件工程2002",
      //     id: 0,
      //     TeacherName: "许正韬",
      //     College: "计算机科学与工程学院",
      //     Time: "2022/07/20 - 2023/07/21",
      //     IMG: "https://cdn.vuetifyjs.com/images/cards/docks.jpg",
      //   },
      // {Name:'软件工程2002', id:5, TeacherName:'许正韬', Time:'2022/07/20 - 2023/07/21'}
    ],
    prepareing_overlay: true,
  }),
  methods: {},
  mounted() {
    this.$store.commit("updatePageName", "我的课程");
    NProgress.set(0.35);
    // NProgress.configure({ parent: "#main" });
    token = window.localStorage.getItem("token");
    let _this = this;
    // init axios
    _axios.interceptors.request.use(function (config) {
      config.headers = {
        Authorization: token,
      };
      return config;
    });

    // getCourses
    _axios.post("/api/Course/getMyCourse").then((res) => {
      NProgress.set(0.8);
      let coursesData = res.data.data;
      let coursesData_arr = eval(coursesData);
      _this.courses = coursesData_arr;
      _this.prepareing_overlay = false;
      NProgress.set(1);
    });
    if (window.localStorage.getItem("cid_temp") != -1) {
      this.$router.replace({
        name: "CourseContent",
        params: { cid: window.localStorage.getItem("cid_temp") },
      });
      window.localStorage.setItem("cid_temp", -1);
    } else {
    }
  },
  created() {},
  components: { Course, TodoList, CourseTable },
};
</script>

<style>
.course_img {
  display: flex;
  justify-content: center;
  align-items: center;
}
.foot {
  height: 50px;
}
</style>
