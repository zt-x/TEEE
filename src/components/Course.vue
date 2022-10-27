<template>
  <v-card
    class="mx-auto"
    max-width="400"
    min-width="100"
    max-height="400px"
    :hover="hover"
    ripple
  >
    <v-img color="brown" class="white--text align-end" height="100px" :src="Course.IMG">
      <v-card-title v-text="Course.Name"></v-card-title>
    </v-img>

    <v-card-subtitle class="pb-0" v-text="Course.TeacherName"></v-card-subtitle>

    <v-card-text style="font-size: small">
      <!-- <div>Whitehaven Beach</div>
			<div>Whitsunday Island, Whitsunday Islands</div> -->
      <div class="text--secondary">{{ Course.College }}</div>

      <div>{{ Course.Time }}</div>
    </v-card-text>

    <v-card-actions>
      <v-btn color="orange" text @click="InterCourse(Course.id)"> 进入课程 </v-btn>

      <v-btn color="orange" text> 查看统计 </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["Course"],
  data: () => ({
    hover: true,
  }),
  methods: {
    InterCourse(cid) {
      this.$router.push({ name: "CourseContent", params: { courseID: cid } });
    },
  },
};
</script>

<style></style>
