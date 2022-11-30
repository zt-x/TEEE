<template>
  <v-card>
    <v-card-title>添加选择题</v-card-title>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-textarea
            filled
            label="输入题目内容"
            clearable
            no-resize
            rows="10"
            v-model="ans_text"
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="6">
          <v-text-field
            label="添加正确答案"
            dense
            append-icon="fas fa-plus"
            v-model="a_ans"
            hint="按下回车键或右侧加号添加"
            @keypress.enter="addCorrAns()"
            @click:append="addCorrAns()"
            color="success"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            label="添加错误答案"
            dense
            append-icon="fas fa-plus"
            hint="按下回车键或右侧加号添加"
            v-model="a_err_ans"
            @click:append="addErrAns()"
            @keypress.enter="addErrAns()"
            color="error"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col cols="6" v-for="(ans, i) in qans" :key="i">
          <v-chip
            label
            close
            :color="ans.isCorr ? `success` : `error`"
            @click:close="removeAns(i)"
          >
            <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
              {{ ans.ans }}
            </span>
          </v-chip>
        </v-col>
      </v-row>
    </v-container>
    <v-card-actions>
      <div style="width: 100px">
        <v-text-field
          label="分值"
          dense
          hint="请输入一个整数或Float"
          v-model="ans_score"
        ></v-text-field>
      </div>
      <v-spacer></v-spacer>

      <span class="red--text">{{ this.msg }}</span>
      <v-spacer></v-spacer>

      <v-btn color="green darken-1" text @click="close()">算了</v-btn>
      <v-btn color="green darken-1" min-width="60px" class="white--text" @click="add()"
        >添加</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      qans: [],
      a_ans: "",
      a_err_ans: "",
      ans_score: "",
      ans_text: "",
      rules: {
        required: (value) => !!value || "不能为空！",
      },
      msg: "",
    };
  },
  computed: {
    form() {
      return {
        qans: this.qans,
        a_ans: this.a_ans,
        a_err_ans: this.a_err_ans,
        ans_score: this.ans_score,
        ans_text: this.ans_text,
      };
    },
  },
  methods: {
    close() {
      this.qans = [];
      this.a_ans = "";
      this.a_err_ans = "";
      this.ans_score = "";
      this.ans_text = "";
      this.msg = "";
      this.$emit("closeAddChoicQue", false);
    },
    add() {
      // 返回JSON
      //{qtype: 30010, qscore: 2.0,
      //qtext: "1111", qans: ["", "", "", ""], cans: [0]}
      let _qans = [];
      let _cans = [];
      let newQue = {};
      for (let i = 0; i < this.qans.length; i++) {
        _qans.push(this.qans[i].ans);
        if (this.qans[i].isCorr == true) {
          _cans.push(i);
        }
      }
      if (this.ans_score == "") {
        this.msg = "分值不能为空";
        return;
      } else if (this.ans_text == "") {
        this.msg = "题目内容不能为空";
        return;
      } else if (_qans.length == 0) {
        this.msg = "请添加选项!";
        return;
      } else if (_cans.length == 0) {
        this.msg = "请添加正确选项!";
        return;
      } else if (isNaN(this.ans_score)) {
        this.msg = "请输入一个正确的分数!";
        return;
      }

      newQue.qtype = 30010;
      newQue.qscore = this.ans_score;
      newQue.qtext = this.ans_text;
      newQue.qans = _qans;
      newQue.cans = _cans;
      this.qans = [];
      this.a_ans = "";
      this.a_err_ans = "";
      this.ans_score = "";
      this.ans_text = "";
      this.msg = "";
      this.$emit("addChoicQue", newQue);
    },
    addCorrAns() {
      let data = {};
      data.ans = this.a_ans;
      data.isCorr = true;
      this.qans.push(data);
      this.a_ans = "";
    },
    addErrAns() {
      let data = {};
      data.ans = this.a_err_ans;
      data.isCorr = false;
      this.a_err_ans = "";
      this.qans.push(data);
    },
    removeAns(i) {
      this.qans.splice(i, 1);
    },
  },
};
</script>

<style scoped></style>
