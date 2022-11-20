<template>
  <v-card class="font-weight-black">
    <Dialog_msg
      :dialog_msg="dialog_msg"
      :msg="dialog_msg_msg"
      @closeFunc="closeFunc($event)"
    />
    <v-dialog persistent v-model="dialog_ifSaveAsWorkBank" width="400px">
      <v-card>
        <v-card-title>保存到作业库</v-card-title>
        <v-text-field
          v-model="work_name"
          label="作业库名称"
          hint="作业库中的作业可以重复使用。若不想保存至作业库, 可不填"
          solo
        ></v-text-field>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="releaseWork(true)"
            >不保存, 直接发布</v-btn
          >
          <v-btn color="green darken-1" @click="releaseWork(false)" class="white--text"
            >保存</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent v-model="dialog_addChoicQue" width="600px">
      <add-choic-que
        @closeAddChoicQue="closeAddChoicQue($event)"
        @addChoicQue="returnChoicQue($event)"
      />
    </v-dialog>
    <v-dialog persistent v-model="dialog_addFillInQue" width="600px">
      <add-fill-in-que
        @closeAddFillInQue="closeAddFillInQue($event)"
        @addFillInQue="returnFillInQue($event)"
      />
    </v-dialog>
    <v-dialog persistent v-model="dialog_addTextQue" width="900px">
      <add-text-que
        @closeAddTextQue="closeAddTextQue($event)"
        @addTextQue="returnTextQue($event)"
      />
    </v-dialog>

    <v-card-title class="headline">
      <v-icon left>fa fa-paper-plane</v-icon>
      <span class="font-weight-black" style="color: #757575">发布作业</span>
      <v-spacer></v-spacer>
      <v-chip small color="grey" @click="close('minus')">
        <v-icon x-small center color="white">fa fa-minus</v-icon>
      </v-chip>
      <v-chip class="ml-2" small color="red" @click="close('close')">
        <v-icon x-small center color="white">fa fa-times</v-icon>
      </v-chip>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-row>
          <v-col cols="3">
            <v-text-field
              required
              clearable
              color="#875438"
              label="作业标题"
              :rules="[rules.required]"
              v-model="workTitle"
            ></v-text-field>
          </v-col>
          <v-col :cols="releaseWork_isExam ? 2 : 3">
            <v-text-field
              required
              clearable
              color="#875438"
              label="分数"
              v-model="totalScore"
              :rules="[rules.required, rules.mustNum]"
            ></v-text-field>
          </v-col>
          <v-col :cols="releaseWork_isExam ? 2 : 0" v-if="releaseWork_isExam">
            <v-text-field
              required
              clearable
              color="#875438"
              label="作答限时"
              hint="单位为分钟"
              v-model="timeLimit"
              :rules="[rules.required, rules.mustNum]"
            ></v-text-field>
          </v-col>
          <v-col :cols="releaseWork_isExam ? 2 : 3">
            <v-menu
              style="font-size: small"
              v-model="TimeMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              min-width="290px"
              offset-y
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  clearable
                  color="#875438"
                  v-model="deadline"
                  readonly
                  label="作业截止时间"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                color="brown lighten-1"
                locale="zh-cn"
                :first-day-of-week="0"
                v-model="deadline"
                scrollable
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="TimeMenu = false">OK</v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="3">
            <v-checkbox
              v-model="releaseWork_isExam"
              color="#875438"
              label="设为考试"
            ></v-checkbox>
          </v-col>

          <v-col cols="12">
            作业内容:
            <v-radio-group mandatory dense row v-model="workContentRadio">
              <v-radio label="创建新作业" color="#875438" value="createNewWork"></v-radio>
              <v-radio
                label="从作业库中选取"
                color="#875438"
                value="searchFromBank"
              ></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="12">
            <v-menu
              close-on-click
              close-on-content-click
              offset-y
              transition="slide-x-transition"
              v-if="workContentRadio == 'createNewWork'"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-chip class="white--text" color="green" v-bind="attrs" v-on="on">
                  <v-icon small left>fa fa-plus</v-icon>
                  添加题目
                </v-chip>
              </template>
              <v-list>
                <v-list-item @click="addChoicQue()">
                  <v-list-item-title> > 添加选择题</v-list-item-title>
                </v-list-item>
                <v-list-item @click="addFillInQue()">
                  <v-list-item-title> > 添加填空题</v-list-item-title>
                </v-list-item>
                <v-list-item @click="addTextQue()">
                  <v-list-item-title> > 添加简答题</v-list-item-title>
                </v-list-item>
                <v-list-item @click="addQueFromQBank()">
                  <v-list-item-title> > 从题库中选取</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-chip
              class="white--text"
              color="green"
              v-if="workContentRadio == 'searchFromBank'"
              @click="openWorkBank()"
            >
              <v-icon small left>fa fa-folder-open</v-icon>
              打开作业库
            </v-chip>
            <v-chip class="ml-5"> 总分 {{ totalScore }}分 </v-chip>
            <v-chip v-if="choiceQue != 0" class="ml-3">
              选择题 {{ choiceQue }} 题
            </v-chip>
            <v-chip v-if="FillInQue != 0" class="ml-3">
              填空题 {{ FillInQue }} 题
            </v-chip>
            <v-chip v-if="TextQue != 0" class="ml-3"> 简答题 {{ TextQue }} 题 </v-chip>
          </v-col>
          <v-col cols="12">
            <v-card class="px-5 py-5" style="background: #eeeeee">
              <!-- TODO: 点击后进行二次编辑 -->
              <v-chip
                dark
                color="warning"
                class="mx-2 my-1"
                close
                v-for="(ques, i) in questions"
                :key="ques.id"
                @click:close="questions.splice(i, 1)"
              >
                {{ i + 1 }}、 【
                {{
                  JSON.parse(ques).qtype == "30010"
                    ? "选择题"
                    : JSON.parse(ques).qtype == "30011"
                    ? "填空题"
                    : "简答题"
                }}
                】|
                {{ JSON.parse(ques).qtext.slice(0, 20) }}
              </v-chip>
            </v-card>
            <v-row class="ml-0">
              <v-checkbox
                row
                v-model="autoReadoverChoice"
                color="#875438"
                label="自动批改选择题"
              ></v-checkbox>
              <v-checkbox
                class="ml-5"
                v-model="autoReadoverFillIn"
                color="#875438"
                label="自动批改填空题"
              ></v-checkbox>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="green darken-1" text @click="close()">算了</v-btn>
      <v-btn
        color="green darken-1"
        min-width="60px"
        class="white--text"
        @click="beforeReleaseWork()"
        >发布</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import addChoicQue from "./addQuestion/addChoicQue.vue";
import AddFillInQue from "./addQuestion/addFillInQue.vue";
import AddTextQue from "./addQuestion/addTextQue.vue";
import axios from "axios";
import Dialog_msg from "@/components/dialog_msg.vue";
let token = window.localStorage.getItem("token");
export default {
  components: { addChoicQue, AddFillInQue, AddTextQue, Dialog_msg },
  props: ["cid"],
  computed: {
    choiceQue() {
      let arr = this.questions.filter((val) => {
        return JSON.parse(val).qtype == "30010";
      });
      let len = arr.length;
      return len == 0 ? "0" : len;
    },
    FillInQue() {
      let arr = this.questions.filter((val) => {
        return JSON.parse(val).qtype == "30011";
      });
      let len = arr.length;
      return len == 0 ? "0" : len;
    },
    TextQue() {
      let arr = this.questions.filter((val) => {
        return JSON.parse(val).qtype == "30012";
      });
      let len = arr.length;
      return len == 0 ? "0" : len;
    },
  },
  data() {
    return {
      releaseWork_isExam: false,
      workTitle: "",
      workContentRadio: "",
      createNewWork: "",
      searchFromBank: "",
      totalScore: 100,
      Rate: 0.32,
      deadline: "",
      autoReadoverChoice: false,
      autoReadoverFillIn: false,
      dialog_addChoicQue: false,
      dialog_addFillInQue: false,
      dialog_addTextQue: false,
      dialog_addQueFromBank: false,
      dialog_ifSaveAsWorkBank: false,
      dialog_msg: false,
      dialog_msg_msg: "",
      questions: [],
      files: [],
      work_name: "",
      isTemp: false,
      timeLimit: "",
      rules: {
        required: (value) => !!value || "不能为空！",
        mustNum: (val) => !isNaN(val) || "不是有效数字!",
      },
      TimeMenu: "",
      valid: "",
    };
  },
  methods: {
    close(param) {
      if (param == "close") {
        this.workTitle = "";
        this.totalScore = "";
        this.timeLimit = "";
        this.TimeMenu = "";
        this.deadline = "";
        this.releaseWork_isExam = false;
        this.workContentRadio = "";
        this.questions = [];
        this.files = [];
      }
      this.$emit("close", true);
    },
    addChoicQue() {
      this.dialog_addChoicQue = true;
    },
    addFillInQue() {
      this.dialog_addFillInQue = true;
    },
    addTextQue() {
      this.dialog_addTextQue = true;
    },
    addQueFromQBank() {},
    openWorkBank() {},
    closeAddChoicQue(val) {
      this.dialog_addChoicQue = val;
    },
    closeAddFillInQue(val) {
      this.dialog_addFillInQue = val;
    },
    closeAddTextQue(val) {
      this.dialog_addTextQue = val;
    },
    closeQueFromBank(val) {
      this.dialog_addQueFromBank = val;
    },
    returnChoicQue(newQue) {
      this.questions.push(JSON.stringify(newQue));
      this.dialog_addChoicQue = false;
    },
    returnFillInQue(newQue) {
      this.questions.push(JSON.stringify(newQue));
      this.dialog_addFillInQue = false;
    },
    returnTextQue(newQue) {
      this.questions.push(JSON.stringify(newQue));
      this.dialog_addTextQue = false;
    },
    saveAsWork() {},
    beforeReleaseWork() {
      if (this.workTitle == "") {
        alert("请输入作业标题");
        return;
      } else if (this.totalScore == "") {
        alert("请输入分数");
        return;
      } else if (this.questions.length <= 0) {
        alert("请不要发布空作业");
        return;
      }
      this.dialog_ifSaveAsWorkBank = true;
    },
    releaseWork(isTemp) {
      if (isTemp == false) {
        //保存到作业库
        if (this.work_name == "") {
          alert("请输入本次作业在作业库中的名称");
          return;
        } else {
          this.isTemp = false;
        }
      }

      let aWork = {};
      let work = {};
      aWork.cid = this.cid;
      aWork.deadline = this.deadline;
      aWork.totalScore = this.totalScore;
      aWork.workName = this.workTitle;
      aWork.autoReadoverChoice = this.autoReadoverChoice ? 1 : 0;
      aWork.autoReadoverFillIn = this.autoReadoverFillIn ? 1 : 0;
      aWork.workId = 0;
      aWork.timeLimit = this.timeLimit;
      aWork.isExam = this.releaseWork_isExam ? 1 : 0;
      work.workName = this.work_name;
      work.questions = "[" + this.questions.toString() + "]";
      work.isTemp = isTemp ? 1 : 0;
      const _axios = axios.create();
      _axios.interceptors.request.use(function (config) {
        config.headers = {
          Authorization: token,
        };
        return config;
      });
      let _this = this;
      _axios
        .post("/api/Bank/addWorkBank", work)
        .then((res) => {
          aWork.workId = res.data.data;
          _axios.post("/api/Course/releaseAWork", aWork).then((res2) => {
            _this.dialog_msg_msg = res2.data.msg;
            _this.dialog_msg = true;
          });
        })
        .catch((err) => {
          _this.dialog_msg_msg = err;
          _this.dialog_msg = true;
        });
    },
    closeFunc(val) {
      this.dialog_ifSaveAsWorkBank = val;
      this.close();
    },
  },
};
</script>

<style scoped>
::-webkit-scrollbar {
  width: 1px;
  height: 1px;
  background-color: #f5f5f5;
}
/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  background-color: #a36645;
}
</style>
