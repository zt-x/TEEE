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
              <v-card color="basil" flat class="pt-3">
                <SubmitWork
                  v-for="(submit, index) in submit_unfinish"
                  :key="index"
                  :SUBMIT="submit"
                />
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="basil" flat class="pt-3">
                <SubmitWork
                  v-for="(submit, index) in submit_finish"
                  :key="index"
                  :SUBMIT="submit"
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
      submit_finish: [],
      submit_unfinish: [],
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
      const form = new FormData();
      form.append("wid", this.wid);
      _axios
        .post("/api/submit/getAllSubmitByWorkId", form)
        .then((res) => {
          let submits = res.data.data;
          _this.submits = eval(submits);

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
