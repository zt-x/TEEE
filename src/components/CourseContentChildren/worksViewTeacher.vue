<template>
  <v-container>
    <div v-for="work in works" v-bind:key="work.id">
      <v-card style="min-width: 100%" hover ripple="" @click="doWork(work)">
        <v-card-title>
          {{ work.workName }}
          <v-spacer></v-spacer>
          <v-chip small class="ma-2" color="green" text-color="white"> 已完成 </v-chip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-chip
                small
                class="ma-2"
                color="error"
                text-color="white"
                @click="deleteWork()"
                hover
                v-on="on"
                v-bind="attrs"
              >
                <v-icon x-small class="pr-2">fa fa-trash</v-icon>
                Delete
              </v-chip>
            </template>
            <span>删除该作业</span>
          </v-tooltip>
        </v-card-title>
        <v-card-subtitle>123</v-card-subtitle>
      </v-card>
      <div style="height: 5px"></div>
    </div>
  </v-container>
</template>

<script>
export default {
  props: ["works", "cid"],
  computed: {},
  data() {
    return {
      isDelete: false,
    };
  },
  methods: {
    doWork(work) {
      let cid = this.cid;
      if (this.isDelete == false) {
        this.$router.push({
          name: "WorkContent",
          params: { wid: work.id, wname: work.workName, cid: cid },
        });
      } else {
        this.isDelete = false;
      }
    },
    deleteWork() {
      this.isDelete = true;
      this.$dialog({
        title: "删除课程",
        content: "确定要删除该课程嘛？ 删除后无法直接恢复哦",
        btns: [
          {
            label: "算了",
            color: "grey",
            ghost: true,
          },
          {
            label: "确定",
            color: "red darken-5",
            callback: () => {
              // TODO
              alert("删除课程嘞");
            },
          },
        ],
      });
      return;
    },
  },
  created() {},
};
</script>

<style scoped></style>
