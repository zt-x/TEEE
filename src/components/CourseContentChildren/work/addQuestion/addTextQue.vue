<template>
	<v-card>
	  <v-card-title>添加简答题</v-card-title>
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
		ans_score: "",
		ans_text: "",
		rules: {
		  required: (value) => !!value || "不能为空！",
		},
		msg: "",
	  };
	},
	methods: {
	  close() {
		this.ans_score = "";
		this.ans_text = "";
		this.msg = "";
		this.$emit("closeAddTextQue", false);
	  },
	  add() {
		// 返回JSON
		// {qtype: 30012, qscore: 2.0,
		// qtext: "1111", cans: ""}
		if (this.ans_score == "") {
		  this.msg = "分值不能为空";
		  return;
		} else if (this.ans_text == "") {
		  this.msg = "题目内容不能为空";
		  return;
		}
		let newQue = {};
		newQue.qtype = 30011;
		newQue.qscore = this.ans_score;
		newQue.qtext = this.ans_text;
		this.ans_score = "";
		this.ans_text = "";
		this.msg = "";
		this.$emit("addTextQue", newQue);
	  },
	},
  };
  </script>
  
  <style></style>
  