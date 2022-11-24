<template>
  <v-container fluid>
    <v-snackbar
      v-model="snackbar"
      top
      :color="snackbar_color"
      dense="true"
      timeout="2000"
    >
      {{ snackbar_msg }}
    </v-snackbar>
    <v-overlay :value="prepareing_overlay">
      <v-chip>
        <v-progress-circular indeterminate size="16" class="mr-3"></v-progress-circular>
        <v-spacer></v-spacer>
        <span>正在加载库功能 ...</span>
      </v-chip>
    </v-overlay>
    <v-row justify="center">
      <v-col cols="12">
        <v-card rounded="true" style="padding: 10px">
          <v-chip label color="#b97a57">
            <v-icon color="white" x-small left>fa fa-plus</v-icon>
            <span style="color: white">添加新库</span>
          </v-chip>
          <v-chip label class="ml-3" color="#b97a57">
            <v-icon color="white" x-small left>fa fa-search</v-icon>
            <span style="color: white">筛选</span>
          </v-chip>
          <v-chip label class="ml-3" color="#b97a57">
            <v-icon color="white" x-small left>fa fa-inbox</v-icon>
            <span style="color: white">导入</span>
          </v-chip>
        </v-card>
      </v-col>
      <v-col cols="3">
        <v-card>
          <v-card-title>我的库</v-card-title>
          <v-card-subtitle>筛选规则: | |</v-card-subtitle>
          <v-divider></v-divider>
          <v-card-text>
            <v-list>
              <v-list-item-group v-model="item" color="primary">
                <v-list-item v-for="(item, i) in items" :key="i" :inactive="inactive">
                  <v-list-item-content>
                    <v-list-item-title v-html="item.title"></v-list-item-title>
                    <v-list-item-subtitle
                      v-if="twoLine || threeLine"
                      v-html="item.subtitle"
                    ></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="9">
        <v-fab-transtion>
          <v-card>666</v-card>
        </v-fab-transtion>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  mounted() {
    this.$store.commit("updatePageName", "库管理");
  },
  data() {
    return {
      prepareing_overlay: false,
      bankType: ["作业库", "题库"],
      snackbar: false,
      snackbar_color: "warning",
      snackbar_msg: "",
      item: 5,
      items: [
        {
          title:
            "<span class='text--primary'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?",
        },
        {
          title:
            "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend.",
        },
        {
          title: "Oui oui",
        },
        {
          title: "Birthday gift",
        },
        {
          title: "Recipe to try",
        },
      ],
    };
  },
};
</script>

<style></style>
