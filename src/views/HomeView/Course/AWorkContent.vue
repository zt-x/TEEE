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
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card style="background: #eeeeee" color="basil" flat class="pt-3 pb-3">
                <SubmitWork
                  v-for="(submit, index) in submit_unfinish"
                  :key="index"
                  :SUBMIT="submit"
                  class="mb-1"
                />
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card style="background: #eeeeee" color="basil" flat class="pt-3 pb-3">
                <SubmitWork
                  v-for="(submit, index) in submit_finish"
                  :key="index"
                  :SUBMIT="submit"
                  class="mb-1"
                />
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
        .post("/api/submit/getAllSubmitByWorkId", form)
		  .then((res) => {
			  let submits = res.data.data;
			  _this.submits = eval(submits);
			  _this.submits.sort((a, b) => {
				  return b.score - a.score;
			  })
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
        .catch((err) => {
          console.log(err);
        });
    },
    setStatisticsPanel(statistic) {
      this.statistic_content = statistic;
      this.sta = [];
      this.sta.push({ value: statistic.NOP_excellent, name: "优秀(分数>90%)" });
      this.sta.push({ value: statistic.NOP_good, name: "良好(分数在90%~75%)" });
      this.sta.push({ value: statistic.NOP_NTB, name: "及格(分数在60%~75%)" });
      this.sta.push({ value: statistic.NOP_fail, name: "不及格(分数<60%)" });
    },
  },
  mounted() {
    let _this = this;
    this.getAllSubmits().then(() => {
      _this.getStatistics();
    });
  },
};
</script>

<style></style>
