<template>
  <v-card>
    <v-card-title>
      从作业库中选取
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="库名称、作者ID或Tags"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-skeleton-loader
      class="mx-auto"
      max-width="100%"
      type="table"
      v-if="!finishGetData"
    ></v-skeleton-loader>
    <v-card-text v-if="finishGetData">
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="values"
        :search="search"
        single-select
        item-key="id"
        show-select
        class="elevation-1"
      ></v-data-table>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="close()" color="brown" text>取消</v-btn>
      <v-btn @click="add()" color="brown" v-if="selected.length > 0" text>确定</v-btn>
    </v-card-actions>
    <v-snackbar
      absolute
      v-model="snackbar"
      v-if="snackbar"
      top
      :color="snackbar_color"
      dense="true"
      timeout="1000"
    >
      {{ snackbar_msg }}
    </v-snackbar>
  </v-card>
</template>

<script>
import axios from "axios";
let token = window.localStorage.getItem("token");
const _axios = axios.create();
let _this;
export default {
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
    this.snackbar_msg = "正在拉取作业库😀 ..";
    this.snackbar = true;
    this.getWorkBank();
  },
  data() {
    return {
      snackbar: false,
      snackbar_color: "success",
      snackbar_msg: "",
      selected: [],
      search: "",
      finishGetData: false,
      headers: [
        {
          text: "库名称",
          align: "start",
          sortable: false,
          value: "bankName",
        },
        { text: "作者ID", value: "author", sortable: false },
        { text: "Tags", value: "tags" },
      ],
      values: [],
    };
  },
  methods: {
    parseTags(str) {
      let arr = eval(str);
      let ret = "";
      if (str == null || str == "") {
        return "";
      }

      arr.forEach((el) => {
        ret += el + " | ";
      });
      return ret;
    },
    getWorkBank() {
      _axios
        .post("/api/Bank/getWorkBankByTid")
        .then((res) => {
          if (Number(res.data.code) != 1) {
            _this.values = eval(res.data.data);
            for (let i = 0; i < _this.values.length; i++) {
              _this.values[i].tags = this.parseTags(_this.values[i].tags);
            }
          }
          _this.finishGetData = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    close() {
      this.$emit("closeQueFromBank", false);
    },
    add() {
      let ret = {};
      ret.id = this.selected[0].id;
      ret.bn = this.selected[0].bankName;
      this.$emit("addFormBank", ret);
    },
  },
};
</script>

<style></style>
