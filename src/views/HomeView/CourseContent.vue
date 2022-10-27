<template>
  <v-container fluid style="background-color: red">
    <v-row>
      <!-- Course WorkPlace -->
      <v-col cols="12" sm="8">
        <v-card>
          <v-tabs v-model="tab" background-color="transparent" color="basil">
            <v-tab v-for="item in items" :key="item">
              {{ item }}
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item :key="items[0]">
              <v-card color="basil" flat>
                <WorksView :cid="cid" />
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="basil" flat>
                <ExamsView :cid="cid" />
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="basil" flat>
                <Announcement :cid="cid" />
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
      <!-- Course Info -->
      <v-col cols="12" sm="4">
        <v-card>
          <v-card-title>CourseName{{ this.cid }}</v-card-title>
          <v-card-subtitle>2022/ 09/ 01 - 20</v-card-subtitle>
          <v-card-text>TEXT1</v-card-text>
          <v-card-text>TEXT2</v-card-text>
          <v-card-text>TEXT3</v-card-text>
          <v-card-text>TEXT4</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Announcement from "@/components/CourseContentChildren/announcement.vue";
import ExamsView from "@/components/CourseContentChildren/examsView.vue";
import WorksView from "@/components/CourseContentChildren/worksView.vue";
export default {
  components: { ExamsView, Announcement, WorksView },
  data() {
    return {
      tab: null,
      items: ["作业", "考试", "公告"],
      cid: 0,
    };
  },
  created() {
    this.cid = this.$route.params.cid;
  },
};
</script>

<style></style>
