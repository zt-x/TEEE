<template>
  <v-btn
    :color="color"
    style="
      width: 44px;
      min-width: 44px;
      height: 44px;
      margin-right: 5px;
      margin-left: 5px;
      margin-top: 5px;
    "
    class="white--text"
    @click="status = 1"
    >1</v-btn
  >
</template>

<script>
export default {
  computed: {
    color() {
      return this.status == 0 ? "blue" : "grey";
    },
  },
  data() {
    return {
      status: 0,
    };
  },
};
</script>

<style scoped></style>
