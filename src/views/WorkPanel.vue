<template>
  <v-card style="min-width: 1520px; background: #b97a57; min-height: 1080px">
    <v-app-bar color="white" app>
      <v-card-title>
        <v-chip @click="goBack()" small class="ma-2" color="#555555" text-color="white"
          ><v-icon small left>fa fa-reply</v-icon>返回</v-chip
        >
        {{ wname }}</v-card-title
      >
    </v-app-bar>

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
                        <div class="px-8 py-5" v-else-if="item.qtype == 30012">
                          <div>
                            <div style="100%">
                              <ckeditor
                                v-model="myAnss[i]"
                                :config="editorConfig"
                                editor-url="/ckeditor/ckeditor.js"
                              ></ckeditor>
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
import CKEditor from "ckeditor4-vue";
const _axios = axios.create();
let token = window.localStorage.getItem("token");
export default {
  components: { QueNum, ckeditor: CKEditor.component },
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
    cid() {
      return this.$route.params.cid;
    },
    wname() {
      if (this.$route.params.wname == null) {
        //测试环境
        return "测试环境题目";
      } else {
        return this.$route.params.wname;
      }
    },
  },
  data() {
    return {
      p_que: 0,
      qs: [],
      myAnss: [],
      flushButton: true,
      editorConfig: {
        removeButtons:
          "Source,Save,NewPage,ExportPdf,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Find,Replace,SelectAll,Scayt,Form,TextField,Textarea,Select,Button,ImageButton,Radio,Checkbox,HiddenField,CopyFormatting,RemoveFormat,BulletedList,NumberedList,Outdent,Indent,Blockquote,CreateDiv,BidiLtr,BidiRtl,Language,Anchor,Unlink,Link,Smiley,Iframe,PageBreak,Styles,Format,About,ShowBlocks",
        toolbarGroups: [
          { name: "document", groups: ["mode", "document", "doctools"] },
          { name: "clipboard", groups: ["clipboard", "undo"] },
          { name: "editing", groups: ["find", "selection", "spellchecker", "editing"] },
          { name: "forms", groups: ["forms"] },
          { name: "basicstyles", groups: ["basicstyles", "cleanup"] },
          {
            name: "paragraph",
            groups: ["list", "indent", "blocks", "align", "bidi", "paragraph"],
          },
          { name: "links", groups: ["links"] },
          { name: "insert", groups: ["insert"] },
          { name: "styles", groups: ["styles"] },
          { name: "colors", groups: ["colors"] },
          { name: "tools", groups: ["tools"] },
          { name: "others", groups: ["others"] },
          { name: "about", groups: ["about"] },
        ],
      },
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
      let _cid = this.cid;
      //   alert(_cid);
      this.$router.replace({
        name: "home",
        params: { targetName: "CourseContent", pars: { pname: "cid", pvalue: _cid } },
      });
      //   this.$router.back();
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
      } else if (val == 4) {
        return "E";
      } else if (val == 5) {
        return "F";
      } else if (val == 6) {
        return "G";
      } else if (val == 7) {
        return "H";
      } else if (val == 8) {
        return "I";
      } else if (val == 9) {
        return "J";
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
                let ass = this.myAnss;
                let str = "[";
                const form = new FormData();
                form.append("wid", this.wid);

                // 手动装配arr， 避免直接使用toString拉直成一维 ....
                for (var i = 0; i < ass.length; i++) {
                  if (Array.isArray(ass[i])) {
                    str += "[" + ass[i].toString() + "], ";
                  } else {
                    str += ass[i] + ", ";
                  }
                }
                str = str.slice(0, -2);
                str += "]";

                str = str.replaceAll('"', "&quot;");
                str = str.replaceAll(",", "&douhao;");

                form.append("ans", str);
                _axios
                  .post("/api/submit/submitWork", form)
                  .then((res) => {
                    this.$dialog({
                      content: res.data.msg,
                      btns: [
                        {
                          label: "芜湖",
                          color: "#09f",
                          // ghost: true,
                        },
                      ],
                    });
                  })
                  .catch((err) => {});
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
                let ass = this.myAnss;
                let str = "[";
                const form = new FormData();
                form.append("wid", this.wid);

                // 手动装配arr， 避免直接使用toString拉直成一维 ....
                for (var i = 0; i < ass.length; i++) {
                  if (Array.isArray(ass[i])) {
                    str += "[" + ass[i].toString() + "], ";
                  } else {
                    str +=
                      ass[i].replaceAll('"', "&quot;").replaceAll(",", "&douhao;") + ", ";
                  }
                }
                str = str.slice(0, -2);
                str += "]";

                form.append("ans", str);
                _axios
                  .post("/api/submit/submitWork", form)
                  .then((res) => {
                    this.$dialog({
                      content: res.data.msg,
                      btns: [
                        {
                          label: "芜湖",
                          color: "#09f",
                          // ghost: true,
                        },
                      ],
                    });
                  })
                  .catch((err) => {});
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
