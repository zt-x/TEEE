<template>
  <v-card style="min-width: 1520px; background: #875438; min-height: 1080px">
    <v-card-title>666</v-card-title>
    <v-card-text>
      <v-container fluid>
        <v-row>
          <!-- 答题卡 -->
          <v-col cols="2">
            <v-card>
              <v-card-title>答题卡</v-card-title>
              <v-divider></v-divider>
              <div style="background: #eeeeee" class="py-5">
                <v-container fluid>
                  <v-row>
                    <v-col cols="12">
                      <div style="height: 5px"></div>
                      <div class="mx-auto text-center">
                        <QueNum v-for="i in 8" :key="i" />
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </div>
            </v-card>
          </v-col>
          <!-- 答题区 -->
          <v-col cols="10">
            <v-card min-width="500px">
              <v-card-title>题目</v-card-title>
              <v-divider></v-divider>
              <div style="background: #eeeeee" class="py-5">
                <v-card class="mx-auto my-5" style="width: 95%">
                  <v-tabs
                    v-model="tab"
                    background-color="transparent"
                    hide-slider
                    color="brown"
                  >
                    <v-tab v-for="item in items" :key="item.tab">
                      {{ item.tab }}
                    </v-tab>
                  </v-tabs>

                  <v-tabs-items v-model="tab">
                    <v-tab-item v-for="item in items" :key="item.tab">
                      <v-card flat>
                        <v-card-text>{{ item.content }}</v-card-text>
                      </v-card>
                    </v-tab-item>
                  </v-tabs-items>
                </v-card>
              </div>
              <v-card-title>题目</v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import QueNum from "@/components/WorkPanel/QueNum.vue";
export default {
  components: { QueNum },
  data() {
    return {
      tab: null,
      items: [
        { tab: "One", content: "Tab 1 Content" },
        { tab: "Two", content: "Tab 2 Content" },
        { tab: "Three", content: "Tab 3 Content" },
        { tab: "Four", content: "Tab 4 Content" },
        { tab: "Five", content: "Tab 5 Content" },
        { tab: "Six", content: "Tab 6 Content" },
        { tab: "Seven", content: "Tab 7 Content" },
        { tab: "Eight", content: "Tab 8 Content" },
        { tab: "Nine", content: "Tab 9 Content" },
        { tab: "Ten", content: "Tab 10 Content" },
      ],
    };
  },
};
</script>

<style></style>
