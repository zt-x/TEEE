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
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row align-content="center">
        <v-col cols="5">
          <v-text-field
            label="添加正确答案"
            dense
            prepend-icon="fas fa-plus"
            v-model="a_ans"
            @click:prepend="addCorrAns()"
          ></v-text-field>
        </v-col>
        <v-col cols="5">
          <v-text-field
            label="添加错误答案"
            dense
            prepend-icon="fas fa-plus"
            v-model="a_err_ans"
            @click:prepend="addErrAns()"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" v-for="(ans, i) in qans" :key="i">
          <v-chip close :color="ans.isCorr ? `success` : `error`">
            {{ ans.ans }}
          </v-chip>
        </v-col>
      </v-row>
    </v-container>
    <v-card-action>
      <v-btn @click="close()">111</v-btn>
    </v-card-action>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      qans: [],
      a_ans: "",
      a_err_ans: "",
    };
  },
  methods: {
    close() {
      this.$emit("closeAddChoicQue", false);
    },
    add() {
      // 返回JSON
      //{qtype: 30010, qscore: 2.0,
      //qtext: "1111", qans: ["", "", "", ""], cans: [0]}
    },
    addCorrAns() {
      let data = {};
      data.ans = this.a_ans;
      data.isCorr = true;
      this.qans.push(data);
    },
    addErrAns() {
      let data = {};
      data.ans = this.a_err_ans;
      data.isCorr = false;
      this.qans.push(data);
    },
  },
};
</script>

<style></style>
