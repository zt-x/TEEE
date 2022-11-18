<template>
  <v-container>
    <div v-for="work in works" v-bind:key="work.id">
      <v-card style="min-width: 100%" hover ripple="" @click="doWork(work)">
        <v-card-title>
          {{ work.workName }}
          <v-spacer></v-spacer>
          <v-chip small class="ma-2" color="green" text-color="white" v-if="loading_subNum"> {{work.subNum}} | {{work.submit_totalNum}}</v-chip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-chip
                small
                class="ma-2"
                color="error"
                text-color="white"
                @click="deleteWork(work)"
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
        <v-card-subtitle
          >截止时间 | {{ work.deadline == null ? " - " : work.deadline }}</v-card-subtitle
        >
      </v-card>
      <div style="height: 5px"></div>
    </div>
    <v-snackbar
      v-model="snackbar"
      style="margin-top: 64px"
      top
      right
      color="success"
      dense="true"
      timeout="1000"
    >
      {{ msg }}
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from "axios";
const _axios = axios.create();
let token = window.localStorage.getItem("token");
export default {
  props: ["works", "cid"],
  computed: {},
  data() {
    return {
      isDelete: false,
      snackbar: false,
		msg: "",
		loading_subNum:false,
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
	  getSubStatus() {
		  let _this = this;
		const form = new FormData();
		  form.append("cid", this.cid);
		// TODO
		  _axios.post("/api/Course/getAllWorkSummary", form).then((res) => {
			  let data = res.data.data;
			  let arr = eval(data.works);
			  _this.submit_totalNum = data.submit_totalNum;
			  arr.forEach((item) => {
				  _this.works.forEach((w, i) => {
					  if (item.wid == w.id) {
						  w.subNum = item.subNum;
						  w.rDone = item.rDone;
					  }
				  })
			  })
			  loading_subNum = true;
			  console.log(_this.works);
		  })
	},
    deleteWork(work) {
      let _this = this;

      this.isDelete = true;
      this.$dialog({
        title: "删除作业",
        content: "确定要删除该作业嘛？ 删除后无法直接恢复哦",
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
              token = window.localStorage.getItem("token");
              // init axios
              _axios.interceptors.request.use(function (config) {
                config.headers = {
                  Authorization: token,
                };
                return config;
              });
              const form = new FormData();
              form.append("wid", work.id);
              _axios
                .post("/api/Course/deleteAWork", form)
                .then((res) => {
                  _this.msg = res.data.msg;
                  _this.snackbar = true;
                  _this.$emit("flush", true);
                })
                .catch((err) => {
                  _this.msg = "发生了错误" + err;
                  _this.snackbar = true;
                });
            },
          },
        ],
      });
      return;
    },
  },
	created() {
		this.loading_SubStatus = false;
    token = window.localStorage.getItem("token");
    _axios.interceptors.request.use(function (config) {
      config.headers = {
        Authorization: token,
      };
      return config;
	});
		this.getSubStatus();
  },
};
</script>

<style scoped></style>
