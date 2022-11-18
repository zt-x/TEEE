<template>
  <v-container>
    <div v-for="work in works" v-bind:key="work.id">
      <v-card
        style="min-width: 100%"
        hover
        ripple=""
        @click="doWork(work)"
        @contextmenu.prevent="mouseclick()"
      >
        <v-card-title>
          {{ work.workName }}
          <v-spacer></v-spacer>

          <v-chip
            v-if="finishGetStatus"
            small
            :color="scoreColor(work.id)"
            text-color="white"
            class="mr-2"
          >
            {{ getScore(work.id) }}
          </v-chip>
          <span style="color: #eeeeee">|</span>
          <v-chip
            v-if="finishGetStatus"
            small
            class="ma-2"
            :color="statusColor(work.id)"
            text-color="white"
          >
            {{ status(work.id) }}
          </v-chip>
        </v-card-title>
        <v-card-subtitle
          >截止时间 | {{ work.deadline == null ? " - " : work.deadline }}</v-card-subtitle
        >
      </v-card>
      <div style="height: 5px"></div>
    </div>
    <v-dialog v-model="dialog_stuAnsStu">
		<stuAnsStu :SUBMIT="submits" :qscores="qscores"/>
	</v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
import stuAnsStu from './stuAnsStu.vue';
const _axios = axios.create();
let token = window.localStorage.getItem("token");
export default {
  components: { stuAnsStu },
  props: ["works", "cid"],
  computed: {},
	methods: {
	async getWork(wid) {
      token = window.localStorage.getItem("token");
      let _this = this;
      // init axios
      _axios.interceptors.request.use(function (config) {
        config.headers = {
          Authorization: token,
        };
        return config;
      });
      const form = new FormData();
      form.append("wid", wid);
      _axios
        .post("/api/Work/getWork", form)
        .then((res) => {
          let questions = res.data.data;
          _this.qs = eval(questions);
          _this.qs.forEach((val, i) => {
            _this.qscores[i] = val.qscore;
          });
        })
        .catch((err) => {});
    },
		doWork(work) {
			let _this = this;
      if (this.status(work.id) == "未提交") {
        this.$router.push({
          name: "doWork",
          params: { wid: work.id, wname: work.workName, cid: cid },
        });
	  } else {
		  this.getWork(work.id).then((res) => {
			// TODO
			const form = new FormData();
			form.append("wid", work.id);
			_axios
				.post("/api/submit/getSubmitByWorkId", form)
				.then((res) => {
					_this.submits = eval(res.data.data);
					_this.dialog_stuAnsStu = true;
				})
				.catch((err) => {
					// TODO
					_this.msg = "发生了错误" + err;
					_this.snackbar = true;
				});
		  });

      }
    },
    closeSubmitCard() {},
    status(wid) {
      let ret = "";
      this.finish_status.forEach((val, i) => {
        if (val.wid == wid) {
          ret = val.status;
          if (val.status == -1) {
            ret = "未提交";
          } else if (val.status == 0) {
            ret = "批改中";
          } else if (val.status == 1) {
            ret = "已批改";
          }
        }
      });
      return ret;
    },
    statusColor(wid) {
      let ret = "";
      this.finish_status.forEach((val, i) => {
        if (val.wid == wid) {
          ret = val.status;
          if (val.status == -1) {
            ret = "error";
          } else if (val.status == 0) {
            ret = "warning";
          } else if (val.status == 1) {
            ret = "success";
          }
        }
      });
      return ret;
    },
    scoreColor(wid) {
      let ret = "";
      this.finish_status.forEach((val, i) => {
        if (val.wid == wid) {
          ret = val.status;
          if (ret == -1 || ret == 0) {
            ret = "grey";
          } else {
            if (Number(val.score) < 60) {
              ret = "error";
            } else if (Number(val.score) < 80) {
              ret = "warning";
            } else if (Number(val.score) < 100) {
              ret = "success";
            }
          }
        }
      });
      return ret;
    },
    getScore(wid) {
      let ret = "";
      this.finish_status.forEach((val, i) => {
        if (val.wid == wid) {
          if (val.status == -1) {
            ret = "-";
          } else if (val.status == 0) {
            ret = "-";
          } else if (val.status == 1) {
            ret = val.score;
          }
        }
      });
      return ret;
    },
    async getWorkStatus() {
      //
      // [{wid:, status: ,score:}]
      //
      let _this = this;
      token = window.localStorage.getItem("token");
      // init axios
      _axios.interceptors.request.use(function (config) {
        config.headers = {
          Authorization: token,
        };
        return config;
      });
      const form = new FormData();
      form.append("cid", _this.cid);
      _axios
        .post("/api/Work/getWorkFinishStatus", form)
        .then((res) => {
          let arr = eval(res.data.data);
          arr.forEach((val, i) => {
            _this.finish_status[i] = val;
          });
          _this.finish_status;
          _this.finishGetStatus = true;
        })
        .catch((err) => {
          _this.msg = "发生了错误" + err;
          _this.snackbar = true;
        });
    },
  },
  data() {
    return {
      finish_status: [],
      finishGetStatus: false,
      msg: "",
		snackbar: "",
		dialog_stuAnsStu: false,
		      qs: [],
		qscores: [],
		submits: [],
		wid:0,
    };
  },
  mounted() {
    this.getWorkStatus();
  },
  created() {},
};
</script>

<style scoped></style>
