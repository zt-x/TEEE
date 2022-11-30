<template>
  <v-card>
    <v-card-title>
      <v-chip
        small
        outlined
        dark
        :color="Number(content.isPrivate) == 0 ? 'success' : 'warning'"
        class="mr-2"
        >{{ Number(content.isPrivate) == 0 ? "公开" : "私有" }}</v-chip
      >
      {{ content.BankName }}
      <v-card-subtitle>
        作者:{{ content.author }} | 被使用次数:{{ content.usedTimes }}
      </v-card-subtitle>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text v-if="finishGetData">
      <!-- TAGS -->
      <div class="my-2" style="width: 90%; overflow: hidden">
        标签：
        <v-chip
          small
          label
          color="purple"
          dark
          class="mx-1"
          v-for="(item, i) in tags"
          :key="i"
          >{{ item }}</v-chip
        >
      </div>
      <!-- 题目统计 -->
      <div class="my-3">题目统计:</div>
      <div class="pl-2 my-3">选择题: {{ numOfQue[0] }}道</div>
      <div class="pl-2 my-3">填空题: {{ numOfQue[1] }}道</div>
      <div class="pl-2 my-3">简答题: {{ numOfQue[2] }}道</div>
    </v-card-text>
    <v-card-actions v-if="finishGetData">
      <v-btn color="orange" text> 查看作业库内容 </v-btn>
      <v-btn color="orange" text v-if="Number(content.isMine) == 1">
        编辑作业库信息
      </v-btn>
      <v-btn color="orange" text> 生成分享码 </v-btn>
    </v-card-actions>
    <v-skeleton-loader
      v-if="!finishGetData"
      class="mx-auto"
      max-width="100%"
      type="card"
    ></v-skeleton-loader>
    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar"
      top
      :color="snackbar_color"
      dense="true"
      timeout="2000"
    >
      {{ snackbar_msg }}
    </v-snackbar>
  </v-card>
</template>

<script>
import axios from "axios";
let token = window.localStorage.getItem("token");
const _axios = axios.create();
let _this;
export default {
  props: ["bid"],
  data() {
    return {
      snackbar: false,
      snackbar_color: "brown",
      snackbar_msg: "",
      finishGetData: false,
      content: {},
      tags: [],
      numOfQue: [],
    };
  },
  mounted() {
    _this = this;
    this.$store.commit("updatePageName", "库管理/" + this.bid);
    token = window.localStorage.getItem("token");
    _axios.interceptors.request.use(function (config) {
      config.headers = {
        Authorization: token,
      };
      return config;
    });
    this.getData();
  },
  methods: {
    getData() {
      _this.finishGetData = false;
      _this.content = {};
      _this.tags = [];
      _this.numOfQue = [];
      let form = new FormData();
      form.append("wbid", this.bid);
      _axios
        .post("/api/Bank/getWorkBankContentByID", form)
        .then((res) => {
          if (Number(res.data.code) != 1) {
            console.log(res.data.msg);
            _this.tags = eval(res.data.data.tags);
            _this.numOfQue = eval(res.data.data.numOfQue);
            _this.finishGetData = true;
          } else {
            console.log(res.data.msg);
          }
          _this.content = res.data.data;
        })
        .catch((err) => {
          this.snackbar_msg = err;
          this.snackbar = true;
        });
    },
  },
};
</script>

<style scoped></style>
