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
            <v-tab-item :key="item">
              <v-card color="basil" flat>
                <WorksView />
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="basil" flat>
                <examsView />
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="basil" flat>
                <Announcement />
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
      <!-- Course Info -->
      <v-col cols="12" sm="4">
        <v-card>123</v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Announcement from "@/components/CourseContentChildren/announcement.vue";
import examsView from "@/components/CourseContentChildren/examsView.vue";
import WorksView from "@/components/CourseContentChildren/worksView.vue";
export default {
  components: { examsView, Announcement, WorksView },
  data() {
    return {
      tab: null,
      items: ["作业", "考试", "公告"],
      item_content: ["作业", "考试", "公告"],
    };
  },
};
</script>

<style></style>
