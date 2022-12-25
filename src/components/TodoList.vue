<template>
  <v-card max-height="400px" style="overflow-y: auto; overflow-x: hidden">
    <v-row>
      <v-card-title class="mx-auto overline">
        <v-icon left small color="black">fa fa-calendar-check</v-icon>
        Todo List [施工中...]</v-card-title
      >
    </v-row>
    <v-divider></v-divider>
    <div v-if="!loadingTodoList" class="mx-auto mt-5" style="width: 100%">
      <v-container style="height: 200px">
        <v-row class="fill-height" align-content="center" justify="center">
          <v-col class="subtitle-1 text-center overline" cols="12">
            {{ loadingText }}
          </v-col>
          <v-col cols="6">
            <v-progress-linear
              color="warning"
              indeterminate
              rounded
              height="6"
            ></v-progress-linear>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div v-if="loadingTodoList" class="mx-auto mt-5" style="width: 100%">
      <v-list v-if="role == 'teacher'" rounded>
        <v-subheader>待批改的作业</v-subheader>
        <v-list-item-group v-model="item" color="primary">
          <v-list-item
            v-for="item in items"
            :key="item.CourseID"
            @click="InterCourse(item.CourseID)"
          >
            <v-list-item-icon>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-chip
                    v-on="on"
                    v-bind="attrs"
                    dark
                    color="warning"
                    small
                    class="ml-5"
                  >
                    {{ item.unReadOverWork }}
                  </v-chip>
                </template>
                <span>有 {{ item.unReadOverWork }} 份待批改的作业</span>
              </v-tooltip>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.CourseName }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <v-list v-if="role == 'student'" rounded>
        <v-subheader>未完成的作业</v-subheader>
        <v-list-item-group v-model="item" color="primary">
          <v-list-item v-for="item in items" :key="item.WorkID">
            <v-list-item-content>
              <v-list-item-title>
                <span class="overline" style="font-weight: bold"
                  >[{{ item.CourseName }}

                  <span
                    :style="{
                      color:
                        Math.floor(
                          (new Date(item.Deadline) - new Date()) / (24 * 3600 * 1000)
                        ) +
                          1 >
                        0
                          ? 'green'
                          : 'red',
                    }"
                  >
                    {{
                      Math.floor(
                        (new Date(item.Deadline) - new Date()) / (24 * 3600 * 1000)
                      ) +
                        1 >
                      0
                        ? "距离截止还有" +
                          Math.floor(
                            (new Date(item.Deadline) - new Date()) / (24 * 3600 * 1000)
                          ) +
                          1 +
                          "天"
                        : "! 已截止 !"
                    }}
                  </span>

                  ]
                </span>

                <i>
                  {{ item.WorkName }}
                </i>
                ----
                {{ item.Deadline }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </div>
  </v-card>
</template>

<script>
import axios from "axios";
const _axios = axios.create();
let token = window.localStorage.getItem("token");
export default {
  data: () => ({
    role: "teacher",
    loadingText: "正在初始化Todo List模块 ...",
    item: -1,
    loadingTodoList: false,
    items: [
      { text: "Real-Time", unReadOverWork: "1" },
      { text: "Audience", unReadOverWork: "2" },
      { text: "Conversions", unReadOverWork: "5" },
    ],
  }),
  methods: {
    InterCourse(cid) {
      this.$router.push({ name: "CourseContent", params: { cid: cid } });
    },
  },
  mounted() {
    token = window.localStorage.getItem("token");
    let _this = this;
    // init axios
    _axios.interceptors.request.use(function (config) {
      config.headers = {
        Authorization: token,
      };
      return config;
    });
    _axios
      .get("/api/power")
      .then((r) => {
        _this.role = r.data.data;
        _this.loadingText = "正在为您列出待办事项 ...";
        _axios
          .post("/api/TodoList/getTodoList")
          .then((res) => {
            if (Number(res.data.code == 2)) {
              _this.items = eval(res.data.data);
              if (r.data.data == "student") {
                _this.items = _this.items.sort((a, b) => {
                  return new Date(a.Deadline) - new Date(b.Deadline);
                });
              }
              _this.loadingTodoList = true;
            } else {
              _this.loadingText = res.data.msg;
            }
          })
          .catch((err) => {});
      })
      .catch((err) => {});
  },
};
</script>

<style scoped></style>
