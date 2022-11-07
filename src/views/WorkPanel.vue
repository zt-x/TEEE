<template>
  <v-card style="min-width: 1520px; background: #875438; min-height: 1080px">
    <v-card-title>
      <v-chip @click="goBack()" small class="ma-2" color="black" text-color="white"
        ><v-icon small left>fa fa-reply</v-icon>返回</v-chip
      >
      {{ wid }}</v-card-title
    >
    <v-card-text>
      <v-container fluid>
        <v-row>
          <!-- 答题卡 -->
          <v-col cols="2">
            <v-card style="min-width: 250px" class="mr-5">
              <v-card-title>答题卡</v-card-title>
              <v-divider></v-divider>
              <div style="background: #eeeeee" class="py-5">
                <v-container fluid>
                  <v-row>
                    <v-col cols="12">
                      <div style="height: 5px"></div>
                      <div class="mx-auto text-center">
                        <QueNum
                          v-for="(item, i) in qs"
                          :key="i"
                          :qn="i + 1"
                          :isWrite="!isWrite(i)"
                          @toQue="toQue"
                        />
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </div>
            </v-card>
          </v-col>
          <!-- 答题区 -->
          <v-col cols="10">
            <v-card class="ml-5" min-width="500px">
              <v-card-title>题目</v-card-title>
              <v-divider></v-divider>
              <div style="background: #eeeeee" class="py-5">
                <v-card class="mx-auto my-5" style="width: 95%">
                  <v-tabs
                    v-model="tab"
                    background-color="transparent"
                    hide-slider
                    color="brown"
                    height="0px"
                  >
                    <v-tab v-for="(item, i) in qs" :key="i"> </v-tab>
                  </v-tabs>
                  <v-tabs-items v-model="tab">
                    <v-tab-item v-for="(item, i) in qs" :key="i">
                      <v-card flat>
                        <v-card-text style="font-size: 20px">
                          <span style="font-weight: bold"
                            >{{ i + 1 }}、 ({{ item.qscore }}分)</span
                          >
                          <span class="pl-5">{{ item.qtext }}</span>
                        </v-card-text>
                        <!-- 写答案区 -->
                        <!-- 选择题 -->
                        <div class="pl-8 pt-5" v-if="item.qtype == 30010">
                          <div
                            class="mb-5"
                            v-for="(ans, index) in item.qans"
                            :key="index"
                          >
                            <div>
                              <v-btn
                                style="min-width: 44px; height: 44px; width: 44px"
                                class="mr-5"
                                color="blue"
                                dark
                                v-if="flushButton"
                                :outlined="!isChose(i, index)"
                                @click="chose(i, index)"
                                >{{ map(index) }}</v-btn
                              >
                              <span>{{ ans }} </span>
                            </div>
                          </div>
                        </div>
                        <!-- 填空题 -->
                        <div class="pl-8 pt-5" v-else-if="item.qtype == 30011">
                          <div>
                            <span>我的答案是: </span>
                            <div style="width: 300px">
                              <v-text-field v-model="myAnss[i]"></v-text-field>
                            </div>
                          </div>
                        </div>
                        <!-- 简答题 -->
                        <div class="pl-8 pt-5" v-else-if="item.qtype == 30012">
                          <div>
                            <div style="width: 700px">
                              <v-textarea
                                label="输入你的答案"
                                v-model="myAnss[i]"
                              ></v-textarea>
                            </div>
                          </div>
                        </div>
                      </v-card>
                    </v-tab-item>
                  </v-tabs-items>
                </v-card>
              </div>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  class="mr-1"
                  v-if="p_que > 0"
                  dark
                  outlined
                  color="blue"
                  @click="p_que--"
                  >上一题</v-btn
                >
                <v-btn
                  class="mr-1"
                  v-if="p_que < qs.length - 1"
                  dark
                  outlined
                  color="blue"
                  @click="p_que++"
                  >下一题</v-btn
                >
                <v-btn class="mr-7" dark color="blue" @click="submit()">提交</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from "axios";
import QueNum from "@/components/WorkPanel/QueNum.vue";
import { setRouter } from "@/router";
const _axios = axios.create();
let token = window.localStorage.getItem("token");
export default {
  components: { QueNum },
  computed: {
    tab() {
      return this.p_que;
    },
    wid() {
      if (this.$route.params.wid == null) {
        //测试环境
        return 27;
      } else {
        return this.$route.params.wid;
      }
    },
  },
  data() {
    return {
      p_que: 0,
      qs: [],
      myAnss: [],
      flushButton: true,
    };
  },
  mounted() {
    this.getWork();
  },
  methods: {
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
          _this.myAnss.length = _this.qs.length;
        })
        .catch((err) => {});
    },
    toQue(qid) {
      this.p_que = qid;
    },
    goBack() {
      let cid = this.$route.params.cid;
      this.$router.push({ name: "CourseContent", params: { cid: cid } });
    },
    chose(i, index) {
      let arr = [];
      arr = this.myAnss[i];
      if (arr == undefined) {
        this.myAnss[i] = [];
        arr = this.myAnss[i];
      }
      let p = arr.indexOf(index);
      if (p == -1) {
        //不存在
        arr.push(index);
      } else {
        //存在，删除、
        arr.splice(p, 1);
      }
      this.myAnss[i] = arr;
      this.flushButton = false;
      this.flushButton = true;
    },
    isChose(i, index) {
      let arr = [];
      arr = this.myAnss[i];
      if (arr == undefined) {
        this.myAnss[i] = [];
        arr = this.myAnss[i];
      }
      let p = arr.indexOf(index);
      if (p == -1) {
        return false;
      } else {
        return true;
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
      }
    },
    isWrite(val) {
      if (
        this.myAnss[val] != undefined &&
        this.myAnss[val] != null &&
        this.myAnss[val] != "" &&
        this.myAnss[val].length != 0
      ) {
        return true;
      } else {
        return false;
      }
    },
    submit() {
      let undo = -1;
      for (let i = this.myAnss.length - 1; i >= 0; i--) {
        if (this.isWrite(i) == false) {
          undo = i + 1;
        }
      }
      if (undo != -1) {
        this.$dialog({
          title: "提交作业",
          content: "你的第" + undo + "题还没写哦，确定要提交吗？",
          btns: [
            {
              label: "我再想想",
              color: "#09f",
              ghost: true,
            },
            {
              label: "提交",
              color: "#09f",
              callback: () => {
                console.log(this.myAnss);
              },
            },
          ],
        });
      } else {
        this.$dialog({
          title: "提交作业",
          content: "确定要提交吗？",
          btns: [
            {
              label: "我再想想",
              color: "#09f",
              ghost: true,
            },
            {
              label: "提交",
              color: "#09f",
              callback: () => {
                console.log(this.myAnss);
              },
            },
          ],
        });
      }
    },
  },
};
</script>

<style scoped></style>
