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
          <v-expansion-panel-header
            expand-icon="mdi-menu-down"
            :style="{ color: item == readover_new[i] ? 'black' : '#2196f3' }"
          >
            <div style="width: 25px">
              <v-icon color="green" v-if="readover_new[i] != -1" small>mdi-check</v-icon>
              <v-icon color="warning" v-if="readover_new[i] == -1" small
                >mdi-border-color</v-icon
              >
            </div>

            第{{ i + 1 }}题
            <v-spacer></v-spacer>
            得分：

            {{
              readover_new[i] == -1
                ? "未批改 / " + qscores[i]
                : readover_new[i] + " / " + qscores[i]
            }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            学生提交的答案：
            <div
              style="max-height: 300px; overflow: auto"
              v-html="parseContent(submitContent[i])"
            ></div>
            <div class="mt-5" style="float: right">
              <v-spacer></v-spacer>
              <v-chip small dark color="blue" @click="showChangeScoreDialog(i)">
                {{ readover_new[i] == -1 ? "批改" : "修改得分" }}
              </v-chip>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue" dark text @click="close()">取消</v-btn>
      <v-btn color="blue" dark @click="finish()">完成批改</v-btn>
    </v-card-actions>
    <v-dialog width="300px" v-model="showChangeScore">
      <stuAnsSetScore
        @saveScore="saveScore($event)"
        @exitSaveScore="exitSaveScore($event)"
        v-if="showChangeScore"
        :i="ind_i"
        :max="ind_max"
      />
    </v-dialog>
    <v-overlay v-if="overlay">
      <v-chip>
        <v-progress-circular indeterminate size="16" class="mr-3"></v-progress-circular>
        <v-spacer></v-spacer>
        <span>{{ overlay_msg }}</span>
      </v-chip>
    </v-overlay>
  </v-card>
</template>

<script>
import axios from "axios";
import stuAnsSetScore from "./work/stuAnsSetScore.vue";
const _axios = axios.create();
let token = window.localStorage.getItem("token");
export default {
  components: { stuAnsSetScore },
  props: ["SUBMIT", "qscores"],
  data() {
    return {
      submitContent: [],
      readover: [],
      readover_new: [],
      showChangeScore: false,
      ind_i: 0,
      ind_max: 0,
      overlay: false,
      overlay_msg: "",
    };
  },
  mounted() {
    this.getSubmitContent();
  },
  methods: {
    finish() {
      this.overlay = true;
      this.overlay_msg = "提交批改中 ...";
      const form = new FormData();
      form.append("subid", this.SUBMIT.submitId);
      form.append("score", this.readover_new);
      let _this = this;
      _axios
        .post("/api/submit/setSubmitScore", form)
        .then((res) => {
          _this.overlay = false;
          this.$dialog({
            content: res.data.msg,
            btns: [
              {
                label: "确定",
                color: "#09f",
                callback: () => {
                  _this.close();
                },
              },
            ],
          });
        })
        .catch((err) => {
          alert("finish" + err);
        });
    },
    parseContent(val) {
      let _this = this;
      try {
        // TODO <wait for fixed>
        // 此处存在漏洞 若学生回答刚好能解析成数组， 则会被当做选择题
        let arr = eval(val);
        try {
          if (arr instanceof Array) {
            let str = "";
            for (let i = 0; i < arr.length; i++) {
              str += _this.map(arr[i]) + " ";
            }
            if (str == "") {
              return "无";
            }
            return str;
          } else {
            return val;
          }
        } catch {}
        return "无";
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
          data = JSON.parse(
            data
              .replaceAll("\\r", "&[[换行r]]")
              .replaceAll("\\n", "&[[换行n]]")
              .replaceAll("\\t", "&[[table]]")
          );
          _this.readover = eval(data.readover);
          _this.readover.forEach((val, i) => {
            _this.readover_new[i] = val;
          });
          _this.submitContent = eval(
            "(" +
              data.submitContent
                .replaceAll("&[[换行r]]", "\\r")
                .replaceAll("&[[换行n]]", "\\n")
                .replaceAll("&[[table]]", "\\t")
                .replaceAll("&douhao;", ",") +
              ")"
          );
        })
        .catch((err) => {
          alert("getSub" + err);
        });
    },
    showChangeScoreDialog(i) {
      this.ind_max = this.qscores[i];
      this.ind_i = i;
      this.showChangeScore = true;
    },
    saveScore(data) {
      if (data.score >= 0 && Number(data.score) <= Number(this.qscores[data.i])) {
        this.readover_new[data.i] = data.score;
        this.showChangeScore = false;
      } else {
        alert("分数不能小于0，也不能大于本题的最大分数哦~");
        this.readover_new[data.i] = this.readover[data.i];
      }
      this.showChangeScore = false;
    },
    exitSaveScore(val) {
      this.showChangeScore = false;
    },
  },
};
</script>

<style></style>
