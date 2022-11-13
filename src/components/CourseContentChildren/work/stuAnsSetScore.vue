<template>
  <v-card>
    <v-card-title>第{{ i + 1 }}题</v-card-title>
    <v-card-text> </v-card-text>
    <v-card-actions>
      <span>分数: </span>
      <div class="ml-2" style="width: 50px">
        <v-text-field dense type="number" :max="max" v-model="text_score"></v-text-field>
      </div>
      <v-spacer></v-spacer>
      <v-btn color="blue" dark text @click="exitSaveScore()">取消</v-btn>
      <v-btn color="blue" dark @click="saveScore(i)">确定</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["i", "max"],
  data() {
    return {
      text_score: "",
    };
  },
  methods: {
    saveScore(i) {
      this.$emit("saveScore", { i: i, score: this.text_score });
    },
    exitSaveScore() {
      this.$emit("exitSaveScore", null);
    },
  },
};
</script>

<style></style>
