·
<template>
  <v-container fluid>
    <v-row>
      <!-- Submitted WorkPlace -->
      <v-col cols="12" sm="8">
        <v-card>
          <v-tabs v-model="tab" background-color="transparent" color="basil">
            <v-tab>
              <v-chip color="warning" small>{{ numOfUnFihish }}</v-chip>
              <span class="pl-2">未批改</span>
            </v-tab>
            <v-tab>
              <v-chip small color="success">{{ numOfFinish }}</v-chip>
              <span class="pl-2">已批改</span>
            </v-tab>
            <v-tab>
              <span class="pl-2">打包下载附件</span>
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card style="background: #eeeeee" color="basil" flat class="pt-3 pb-3">
                <SubmitWork
                  v-for="(submit, index) in submit_unfinish"
                  :key="index"
                  :SUBMIT="submit"
                  :qscores="qscores"
                  @flushSubmit="flushSubmit"
                  class="mb-1"
                />
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card style="background: #eeeeee" color="basil" flat class="pt-3 pb-3">
                <SubmitWork
                  transition="scroll-y-transition"
                  v-for="(submit, index) in submit_finish"
                  :key="index"
                  :SUBMIT="submit"
                  @flushSubmit="flushSubmit"
                  :qscores="qscores"
                  class="mb-1"
                />
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card class="mx-auto">
                <div class="mx-auto">
                  <v-btn class="my-5 mx-auto" @click="downloadFiles">打包下载</v-btn>
                </div>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
          <div style="height: 10px"></div>
        </v-card>
      </v-col>
      <!-- Statistic -->
      <v-col cols="12" sm="4">
        <v-card>
          <v-card-title>
            {{ statistic_content.workname }}
            <v-spacer></v-spacer>
            <v-icon small @click="getStatistics()">fas fa-redo</v-icon>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <div style="margin: 0 auto; width: 400px; height: 400px">
                    <Chart_score_statistics :statistic="sta" />
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" top :color="snackbar_color" dense>
      {{ snackbar_msg }}
    </v-snackbar>
  </v-container>
</template>

<script>
import SubmitWork from "@/components/CourseContentChildren/work/submitWork.vue";
import axios from "axios";
import Chart_score_statistics from "@/components/CourseContentChildren/charts/SubmitStatic/chart_score_statistics.vue";
const _axios = axios.create();
let token = window.localStorage.getItem("token");
export default {
  components: { SubmitWork, Chart_score_statistics },
  computed: {
    wid() {
      if (this.$route.params.wid == null) {
        //测试环境
        return 29;
      } else {
        return this.$route.params.wid;
      }
    },
    numOfFinish() {
      return this.submit_finish.length;
    },
    numOfUnFihish() {
      return this.submit_unfinish.length;
    },
  },
  data() {
    return {
      tab: null,
      items: ["未批改", "已批改"],
      submits: [
        { name: "xzt", username: "2020", score: 99 },
        { name: "xzt", username: "2020", score: 99 },
        { name: "xzt", username: "2020", score: 99 },
      ],
      sta: [
        // { value: 2, name: "不及格" },
      ],
      submit_finish: [],
      submit_unfinish: [],
      statistic_content: {},
      sid: 0,
      submitCard: false,
      qs: [],
      qscores: [],
      snackbar_msg: "",
      snackbar: false,
      snackbar_color: "success",
    };
  },
  methods: {
    async flushSubmit(val) {
      this.getAllSubmits();
    },
    async getWork() {
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
          _this.qs.forEach((val, i) => {
            _this.qscores[i] = val.qscore;
          });
        })
        .catch((err) => {});
    },
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
        .post("/api/submit/getAllSubmitByWorkId", form)
        .then((res) => {
          let submits = res.data.data;
          _this.submits = eval(submits);
          _this.submits.sort((a, b) => {
            return b.score - a.score;
          });
          //分离已完成批改和未完成批改的
          _this.submit_finish = _this.submits.filter((item) => {
            return item.finishReadOver == 1;
          });
          _this.submit_unfinish = _this.submits.filter((item) => {
            return (
              item.finishReadOver == 0 ||
              item.finishReadOver == undefined ||
              item.finishReadOver == null
            );
          });
        })
        .catch((err) => {});
    },
    async getStatistics() {
      this.sta = [];
      let _this = this;
      const form = new FormData();
      form.append("wid", this.wid);
      _axios
        .post("/api/submit/getSubmitSummary", form)
        .then((res) => {
          let Statistic = {};
          Statistic = JSON.parse(res.data.data);
          _this.setStatisticsPanel(Statistic);
        })
        .catch((err) => {});
    },
    setStatisticsPanel(statistic) {
      this.statistic_content = statistic;
      this.sta = [];
      this.sta.push({ value: statistic.NOP_excellent, name: "优秀(分数>90%)" });
      this.sta.push({ value: statistic.NOP_good, name: "良好(分数在90%~75%)" });
      this.sta.push({ value: statistic.NOP_NTB, name: "及格(分数在60%~75%)" });
      this.sta.push({ value: statistic.NOP_fail, name: "不及格(分数<60%)" });
    },
    downloadFiles() {
      this.snackbar_msg = "后台正在整理文件并进行打包中, 打包完成后会自动唤醒下载😀 ... ";
      this.snackbar = true;
      let _this = this;
      let form = new FormData();
      form.append("wid", this.wid);
      _axios
        .post("/api/Work/downloadFiles", form, { responseType: "blob" })
        .then((res) => {
          _this.snackbar_msg = "文件已整理完成! 正在唤醒下载链接...";
          try {
            const { data, headers } = res;
            const fileName = headers["content-disposition"].replace(
              /\w+;filename=(.*)/,
              "$1"
            );
            // 此处当返回json文件时需要先对data进行JSON.stringify处理，其他类型文件不用做处理
            //const blob = new Blob([JSON.stringify(data)], ...)
            const blob = new Blob([data], { type: headers["content-type"] });
            let dom = document.createElement("a");
            let url = window.URL.createObjectURL(blob);
            dom.href = url;
            dom.download = decodeURI(fileName);
            dom.style.display = "none";
            document.body.appendChild(dom);
            dom.click();
            dom.parentNode.removeChild(dom);
            window.URL.revokeObjectURL(url);
            _this.snackbar = false;
            return;
          } catch {
            _this.snackbar = true;

            _this.snackbar_msg = res.data.msg;
            _this.snackbar_color = "error";
            _this.setTimeout(() => {
              _this.snackbar = true;
            }, 2000);
            console.log(res.data.msg);
          }
        })
        .catch((err) => {
          console.log(err);
          alert("下载失败, 请查看log信息");
        });
    },
  },
  mounted() {
    let _this = this;
    this.getAllSubmits().then(() => {
      _this.getStatistics().then(() => {
        _this.getWork();
      });
    });
  },
};
</script>

<style scoped></style>
