<template>
  <v-card style="min-width: 1520px; background: #b97a57; min-height: 1080px">
    <v-dialog width="400px" v-if="dialog_upload_info" v-model="dialog_upload_info">
      <v-card loading="brown">
        <v-card-title>正在上传 ...</v-card-title>
        <v-card-text>
          <div v-for="(item, i) in files_realpath" :key="i + 1">
            <span v-for="(f, j) in item" :key="j">
              {{ f.toString().substr(f.indexOf("_").substr(f.substr(f.indexOf("_")))) }}
              <!-- {{ f.subStr(f.indexOf("_").subStr(f.subStr(f.indexOf("_").indexOf("_")))) }} -->
            </span>
            <br />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialog_upload_info = false" v-if="finishUploadingFile"
            >确定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" top :color="snackbar_color" dense timeout="2000">
      {{ snackbar_msg }}
    </v-snackbar>
    <div style="position: fixed; left: 20px; bottom: 20px">
      <v-img
        style="background-position: right center"
        width="150px"
        height="150px"
        src="OIP-C.png"
      ></v-img>
    </div>
    <!-- <v-card fixed dark fab left bottom color="pink"></v-card> -->
    <v-app-bar color="white" app>
      <v-card-title class="text-center">
        <v-chip @click="goBack()" small class="ma-2" color="#555555" text-color="white"
          ><v-icon small left>fa fa-reply</v-icon>返回</v-chip
        >
        <div style="margin-left: 850px">{{ wname }}</div>
      </v-card-title>
    </v-app-bar>

    <v-card-text>
      <v-container fluid>
        <v-row>
          <!-- 答题卡 -->
          <v-col cols="3">
            <v-card style="min-width: 250px">
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
            <v-card style="min-width: 250px" class="mt-5">
              <v-card-title>
                <v-icon class="mr-2">fa fa-clock</v-icon>
                剩余答题时间</v-card-title
              >
              <v-divider></v-divider>
              <div class="text-center py-8" style="background: #eeeeee">
                <span style="font-size: 25px; color: #b97a57">{{ restTimeText }}</span>
              </div>
            </v-card>
          </v-col>
          <!-- 答题区 -->
          <v-col cols="9">
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
                          <span v-if="item.qtype != 30012" class="pl-5">{{
                            item.qtext
                          }}</span>
                          <div
                            v-if="item.qtype == 30012"
                            class="pl-5 pt-5"
                            v-html="item.qtext"
                            style="max-height: 500px; overflow: auto"
                          ></div>
                          <!-- 简答题附件 -->
                          <div class="pl-5 pt-5" v-if="item.qtype == 30012">
                            <span style="font-size: 15px">附件下载</span>
                            <v-card-text>
                              <v-chip
                                class="mx-2 my-1"
                                v-for="file in item.qfiles"
                                :key="file"
                                @click="downloadFile(file)"
                                >{{ getFileName(file.toString()) }}</v-chip
                              >
                            </v-card-text>
                          </div>
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
                          <div class="mt-2">
                            <v-file-input
                              dense
                              v-model="files[i]"
                              color="deep-purple accent-4"
                              multiple
                              placeholder="点击选择添加附件"
                              prepend-icon="mdi-paperclip"
                              outlined
                              @change="sout(files)"
                            >
                              <template v-slot:selection="{ index, text }">
                                <v-chip
                                  close
                                  v-if="index < 3"
                                  color="deep-purple accent-4"
                                  dark
                                  label
                                  small
                                  @click:close="files[i].splice(index, 1)"
                                >
                                  {{ text }}
                                </v-chip>

                                <span
                                  v-else-if="index === 3"
                                  class="overline grey--text text--darken-3 mx-2"
                                >
                                  +{{ files.length - 3 }} File(s)
                                </span>
                              </template>
                            </v-file-input>
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
                <!-- TODO -->

                <v-btn class="mr-1" outlined dark color="blue"> 暂存 </v-btn>
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
var restTimerID;
var restTimerCheckID;
export default {
  components: { QueNum, ckeditor: CKEditor.component },
  computed: {
    tab() {
      return this.p_que;
    },
    wid() {
      if (this.$route.params.wid == null) {
        //测试环境
        return 10;
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
    restTimeText() {
      let value = this.restTime;
      if (value <= -10) {
        return "无限制";
      }
      var secondTime = parseInt(value); // 秒
      var minuteTime = 0; // 分
      var hourTime = 0; // 小时
      if (secondTime > 60) {
        //如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60);
        //获取秒数，秒数取余，得到整数秒数
        secondTime = parseInt(secondTime % 60);
        //如果分钟大于60，将分钟转换成小时
        if (minuteTime > 60) {
          //获取小时，获取分钟除以60，得到整数小时
          hourTime = parseInt(minuteTime / 60);
          //获取小时后取余的分，获取分钟除以60取余的分
          minuteTime = parseInt(minuteTime % 60);
        }
      }
      var result = "" + parseInt(secondTime) + " 秒 ";
      if (minuteTime > 0) {
        result = "" + parseInt(minuteTime) + " 分 " + result;
      }
      if (hourTime > 0) {
        result = "" + parseInt(hourTime) + " 小时 " + result;
      }
      return result;
    },
  },
  data() {
    return {
      files: [],
      files_realpath: [],
      restTime: 0,
      p_que: 0,
      qs: [],
      myAnss: [],
      flushButton: true,
      snackbar: false,
      snackbar_color: "success",
      snackbar_msg: "",
      dialog_upload_info: false,
      finishUploadingFile: false,
      editorConfig: {
        removePlugins: "easyimage",
        extraPlugins: "image2,uploadimage,uploadfile",
        uploadUrl: "/api/upload/img",
        filebrowserBrowseUrl: "/api/upload/img",
        filebrowserImageBrowseUrl: "/api/upload/img",
        filebrowserUploadUrl: "/api/upload/img",
        filebrowserImageUploadUrl: "/api/upload/img",
        removeButtons:
          "Save,NewPage,ExportPdf,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Scayt,SelectAll,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,CopyFormatting,RemoveFormat,Outdent,Indent,Blockquote,CreateDiv,BidiLtr,BidiRtl,Language,Anchor,Table,PageBreak,Iframe,ShowBlocks,About,Source",
        toolbarGroups: [
          { name: "document", groups: ["mode", "document", "doctools"] },
          { name: "clipboard", groups: ["clipboard", "undo"] },
          { name: "editing", groups: ["find", "selection", "spellchecker", "editing"] },
          { name: "forms", groups: ["forms"] },
          { name: "basicstyles", groups: ["basicstyles", "cleanup"] },
          "/",
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
    this.InitTimer();
  },
  methods: {
    sout(val) {
      console.log(val);
    },
    InitTimer() {
      let _this = this;
      if (_this.restTime <= -10) {
        return;
      }
      _this.checkTime().then(() => {
        restTimerID = setInterval(() => {
          _this.restTime--;
          if (_this.restTime < 0 && _this.restTime > -5) {
            clearInterval(restTimerID);
            clearInterval(restTimerCheckID);
            _this.submit(1);
            alert("时间结束咯");
          }
        }, 1000);
      });
      // 倒计时计时器

      // 倒计时校验
      restTimerCheckID = setInterval(() => {
        _this.checkTime();
      }, 1000 * 60 * 5000);
    },
    async checkTime() {
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
      await _axios
        .post("/api/Work/getWorkTimer", form)
        .then((res) => {
          let code = res.data.code;
          if (code == "00001") {
            alert(res.data.msg);
            _this.goBack();
            return;
          }
          let data = res.data.data;
          if (isNaN(data)) {
            _this.restTime = -10;
          } else {
            _this.restTime = Number(data);
          }
        })
        .catch((err) => {});
    },
    getRestTimeText(value) {
      var secondTime = parseInt(value); // 秒
      var minuteTime = 0; // 分
      var hourTime = 0; // 小时
      if (secondTime > 60) {
        //如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60);
        //获取秒数，秒数取余，得到整数秒数
        secondTime = parseInt(secondTime % 60);
        //如果分钟大于60，将分钟转换成小时
        if (minuteTime > 60) {
          //获取小时，获取分钟除以60，得到整数小时
          hourTime = parseInt(minuteTime / 60);
          //获取小时后取余的分，获取分钟除以60取余的分
          minuteTime = parseInt(minuteTime % 60);
        }
      }
      var result = "" + parseInt(secondTime) + "秒";
      if (minuteTime > 0) {
        result = "" + parseInt(minuteTime) + "分" + result;
      }
      if (hourTime > 0) {
        result = "" + parseInt(hourTime) + "小时" + result;
      }
      return result;
    },
    getFileName(str) {
      let str2 = str.substr(str.indexOf("_") + 1);
      return str2.substr(str2.indexOf("_") + 1);
    },
    downloadFile(file) {
      let form = new FormData();
      form.append("fileName", file);
      _axios
        .post("/api/upload/getFile", form, { responseType: "blob" })
        .then((res) => {
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
        })
        .catch((err) => {});
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
          _this.myAnss.length = _this.qs.length;
          _this.files.length = _this.qs.length;
          console.log(_this.files);
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
    async uploadFile(fs) {
      let param = new FormData();
      for (let i in fs) {
        param.append("file", fs[i]);
      }
      this.loading_upload = true;
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      };
      let ret = [];
      // 尝试上传Files
      await axios
        .post("/api/upload/file", param, config)
        .then((res) => {
          if (res.data.code == 1) {
            // 上传失败
            alert("上传文件失败: " + res.data.msg);
            ret = [];
          } else {
            ret = eval(res.data.data);
          }
        })
        .catch((err) => {
          alert("上传失败" + err);
        });

      return ret;
    },
    async prepareUpload() {
      this.finishUploadingFile = false;
      for (let i in this.files) {
        this.files_realpath[i] = await this.uploadFile(this.files[i]);
      }
      this.finishUploadingFile = true;
    },
    async submitWork() {
      let ass = this.myAnss;
      let str = "[";
      const form = new FormData();
      form.append("wid", this.wid);
      //上传文件
      console.log("准备上传队列 ...");
      this.dialog_upload_info = true;
      await this.prepareUpload();
      console.log("结束上传队列 ...");
      return;
      // 手动装配arr， 避免直接使用toString拉直成一维 ....

      for (var i = 0; i < ass.length; i++) {
        if (Array.isArray(ass[i])) {
          str += "[" + ass[i].toString().replaceAll(",", "&douhao;") + "], ";
        } else {
          if (ass[i] == undefined || ass[i] == null) {
            ass[i] = "无";
          }
          str += ass[i] + ", ";
        }
      }
      str = str.slice(0, -2);
      str += "]";

      str = str.replaceAll('"', "&quot;");

      form.append("ans", str);
      _axios
        .post("/api/submit/submitWork", form)
        .then((res) => {
          _this.$dialog({
            content: res.data.msg,
            btns: [
              {
                label: "确定",
                color: "#09f",
                // ghost: true,
                callback: () => {
                  _this.goBack();
                },
              },
            ],
          });
        })
        .catch((err) => {});
    },
    submit(isTimeOver) {
      let _this = this;

      if (isTimeOver == 1) {
        alert("跳过UNDO检测");
        _this.submitWork();
        return;
      }
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
                _this.submitWork();
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
                _this.submitWork();
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
