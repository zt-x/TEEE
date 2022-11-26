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
        <v-card max-height="500px" style="overflow: auto">
          <v-card-title>我的库</v-card-title>
          <v-card-subtitle>请在"筛选"选项中选择作业库/题库</v-card-subtitle>
          <v-divider></v-divider>
          <v-card-text>
            <v-list>
              <v-list-item-group v-model="item" color="primary">
                <v-list-item
                  @click="showBankWork(item.id)"
                  v-for="item in items"
                  :key="item.id"
                >
                  <v-list-item-content>
                    <v-list-item-title>
                      <v-chip
                        small
                        outlined
                        dark
                        :color="Number(item.isPrivate) == 0 ? 'success' : 'warning'"
                        class="mr-2"
                        >{{ Number(item.isPrivate) == 0 ? "公开" : "私有" }}</v-chip
                      >

                      <span style="font-weight: 600">{{ item.bankName }} </span>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="9">
        <v-card max-height="500px" style="overflow: auto">
          <BankWork :bid="bid" v-if="loadBankWork" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BankWork from "@/components/BankManager/bankWork.vue";
import axios from "axios";
let token = window.localStorage.getItem("token");
const _axios = axios.create();
let _this;
export default {
  components: { BankWork },
  mounted() {
    _this = this;
    this.$store.commit("updatePageName", "库管理");
    token = window.localStorage.getItem("token");
    _axios.interceptors.request.use(function (config) {
      config.headers = {
        Authorization: token,
      };
      return config;
    });

    this.getWorkBank();
  },
  data() {
    return {
      prepareing_overlay: false,
      bankType: ["作业库", "题库"],
      snackbar: false,
      snackbar_color: "warning",
      snackbar_msg: "",
      item: 0,
      items: [],
      numOfQue: [],
      bid: -1,
      loadBankWork: false,
    };
  },
  methods: {
    showBankWork(id) {
      this.loadBankWork = false;
      this.bid = id;
      this.$nextTick(() => {
        this.loadBankWork = true;
      });
    },
    getQueBank() {},
    getWorkBank() {
      _axios
        .post("/api/Bank/getWorkBankByTid")
        .then((res) => {
          _this.items = eval(res.data.data);
          _this.bid = _this.items[0].id;
          _this.numOfQue = _this.items[0];
          _this.loadBankWork = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style></style>
