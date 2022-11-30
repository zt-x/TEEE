<template>
  <v-dialog persistent v-model="dialog_msg" width="400px">
    <v-card>
      <v-card-title>提示信息</v-card-title>
      <v-card-text>{{ msg }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="close()">行</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["dialog_msg", "msg"],
  data() {
    return {};
  },
  methods: {
    close() {
      this.$emit("closeFunc", false);
      setTimeout(() => {}, 0);
    },
  },
};
</script>

<style scoped></style>
