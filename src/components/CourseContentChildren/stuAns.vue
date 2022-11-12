<template>
  <v-card>
    <v-card-title
      >{{ SUBMIT.username }} {{ SUBMIT.score.toFixed(1) }}
      <v-spacer></v-spacer>
      <v-chip small @click="close()">
        <v-icon small>fas fa-close</v-icon>
      </v-chip>
    </v-card-title>
    <v-card-subtitle>
      已批改的题目以 <v-icon color="green">mdi-check</v-icon> 标记, 未批改的题目以<v-icon
        color="warning"
        small
        >mdi-border-color</v-icon
      >
      标记。 下列各题得分均为题目的原始分数，总分为经过百分比计算后的得分
    </v-card-subtitle>
    <v-container>
      <v-expansion-panels class="mb-6">
        <v-expansion-panel v-for="(item, i) in readover" :key="i">
          <v-expansion-panel-header expand-icon="mdi-menu-down">
            <div style="width: 25px">
              <v-icon color="green" v-if="item != -1" small>mdi-check</v-icon>
              <v-icon color="warning" v-if="item == -1" small>mdi-border-color</v-icon>
            </div>

            第{{ i + 1 }}题
            <v-spacer></v-spacer>
            得分： {{ item }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            学生提交的答案：

            <div v-html="parseContent(submitContent[i])">
              <!-- {{  }} -->
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
  </v-card>
</template>

<script>
import axios from "axios";
const _axios = axios.create();
let token = window.localStorage.getItem("token");
export default {
  props: ["SUBMIT"],
  data() {
    return {
      submitContent: [],
      readover: [],
    };
  },
  mounted() {
    this.getSubmitContent();
  },
  methods: {
    parseContent(val) {
      let _this = this;
      try {
        // TODO <wait for fixed>
        // 此处存在漏洞 若学生回答刚好能解析成数组， 则会被当做选择题
        let arr = eval(val);
        try {
          if (arr instanceof Array) {
            console.log("arr是Array");
            console.log(arr);
            let str = "";
            for (let i = 0; i < arr.length; i++) {
              str += _this.map(arr[i]) + " ";
            }
            if (str == "") {
              return "无";
            }
            return str;
          } else {
            console.log("arr不是Array");
            return "666";
          }
        } catch {}
        return "666";
      } catch {
        return val.replaceAll("&quot;", '"');
      }
    },
    map(val) {
      if (val == 0) {
        return "A";
      } else if (val == 1) {
        return "B";
      } else if (val == 2) {
        return "C";
      } else if (val == 3) {
        return "D";
      } else if (val == 4) {
        return "E";
      } else if (val == 5) {
        return "F";
      }
    },
    close() {
      this.$emit("closeSubmitCard", false);
    },
    async getSubmitContent() {
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
      form.append("sid", this.SUBMIT.submitId);
      _axios
        .post("/api/submit/getSubmitBySid", form)
        .then((res) => {
          let data = res.data.data;
          console.log(data);
          data = JSON.parse(
            data.replace("\\r", "&[[换行r]]").replace("\\n", "&[[换行n]]")
          );

          _this.readover = eval(data.readover);
          _this.submitContent = eval(
            "(" +
              data.submitContent
                .replace("&[[换行r]]", "\\r")
                .replace("&[[换行n]]", "\\n") +
              ")"
          );
        })
        .catch((err) => {
          alert(err);
        });
    },
  },
};
</script>

<style></style>
