<template>
  <v-card :loading="!getValidate">
    <v-card-title
      >{{ tabs_validate == 0 ? "考前须知" : "人脸验证" }}
      <v-spacer></v-spacer>
      <v-chip v-if="getValidate" class="ml-2" small color="red" @click="close()"></v-chip>
    </v-card-title>
    <v-card-text style="font-size: large">
      <v-tabs-items v-model="tabs_validate">
        <v-tab-item>
          <p v-if="facecheck">😘人脸识别已开启</p>
          <p>{{ rules.text }}</p>
        </v-tab-item>
        <!-- 人脸识别 -->
        <v-tab-item v-if="facecheck">
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <div class="mx-auto" v-if="!submtiFace">
                  请打开浏览器摄像头权限, 面对摄像头
                </div>
                <div class="mx-auto" :color="facecheck_color">{{ facecheck_msg }}</div>
              </v-col>
            </v-row>
            <v-row align="center">
              <v-avatar size="300" class="mx-auto">
                <v-overlay absolute v-if="loading">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                  <div class="mx-auto">{{ loadingText }}</div>
                </v-overlay>
                <video v-show="tackPhoto" id="video" width="400" height="400"></video>
                <canvas
                  id="canvas"
                  v-show="!tackPhoto"
                  width="400"
                  height="400"
                  style="display: block"
                ></canvas>
              </v-avatar>
            </v-row>
            <v-row> </v-row>
          </v-container>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="!getValidate"
        v-if="tab_num == 0 || (facecheck == true && pass_facecheck == true)"
        @click="enterWork"
        dark
        color="blue lighten-1"
        >进入考试</v-btn
      >
      <v-btn
        :disabled="!getValidate"
        v-if="tabs_validate == 0 && tab_num != 0"
        @click="
          tabs_validate += tabs_validate < tab_num ? 1 : 0;
          tackPhoto = true;
        "
        dark
        color="blue lighten-1"
        >开始验证</v-btn
      >
      <v-btn
        text
        :disabled="!getValidate"
        v-if="tabs_validate == 1 && !(facecheck == true && pass_facecheck == true)"
        @click="
          tabs_validate -= tabs_validate > 0 ? 1 : 0;
          tackPhoto = false;
        "
        dark
        color="blue lighten-1"
        >返回上一页</v-btn
      >
      <v-btn
        :disabled="!getValidate"
        v-if="tabs_validate == 1 && !(facecheck == true && pass_facecheck == true)"
        @click="checkFace"
        dark
        color="blue lighten-1"
        >提交人脸</v-btn
      >
      <v-btn
        text
        :disabled="!getValidate"
        v-if="tabs_validate == 1 && !(facecheck == true && pass_facecheck == true)"
        @click="changeCamara"
        dark
        color="blue lighten-1"
        >翻转摄像头</v-btn
      >
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from "axios";
const _axios = axios.create();
let token = window.localStorage.getItem("token");
export default {
  props: ["work", "cid"],
  watch: {
    tackPhoto: {
      immediate: false,
      handler(newVal) {
        //监听接收到拍摄状态后，开始调取摄像头权限。如果功能是在一个组件里面，下面步骤可以直接写在自己的触发方法里面
        if (newVal) {
          this.loading = false;
          var video = document.querySelector("video");

          // 兼容代码
          window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

          if (navigator.mediaDevices === undefined) {
            navigator.mediaDevices = {};
          }
          if (navigator.mediaDevices.getUserMedia === undefined) {
            navigator.mediaDevices.getUserMedia = function (constraints) {
              var getUserMedia =
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia;
              if (!getUserMedia) {
                return Promise.reject(
                  new Error("getUserMedia is not implemented in this browser")
                );
              }
              return new Promise(function (resolve, reject) {
                getUserMedia.call(navigator, constraints, resolve, reject);
              });
            };
          }

          //摄像头调用配置
          var mediaOpts = {
            audio: false,
            video: true,
            video: { facingMode: this.fMode }, // 或者 "user"
            // video: { width: 1280, height: 720 }
            // video: { facingMode: { exact: "environment" } }// 或者 "user"
          };

          let that = this;
          navigator.mediaDevices
            .getUserMedia(mediaOpts)
            .then(function (stream) {
              that.mediaStreamTrack = stream;
              video = document.querySelector("video");
              if ("srcObject" in video) {
                video.srcObject = stream;
              } else {
                video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
              }
              video.play();
              that.loading = false;
            })
            .catch(function (err) {
              console.log(err);
              that.loading = false;
            });
        } else {
          video = document.querySelector("video");
          video.srcObject = null;
          this.mediaStreamTrack.getTracks().forEach((track) => track.stop());
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      tabs_validate: 0,
      tab_num: 0,
      rules: {},
      getValidate: false,
      facecheck: false,
      pass_facecheck: false,
      facecheck_color: "green",
      facecheck_msg: "",
      submtiFace: false,
      // Camara
      canvas: null,
      video: null,
      mediaStreamTrack: "",
      tackPhoto: false,
      fMode: "user",

      //facecheck
      loading: true,
      loadingText: "",
    };
  },
  methods: {
    changeCamara() {
      this.tackPhoto = false;
      if (this.fMode == "user") {
        this.fMode = "environment";
      } else {
        this.fMode = "user";
      }
      this.tackPhoto = true;
    },
    close() {
      this.tackPhoto = false;
      this.$emit("close");
    },
    enterWork(myWork) {
      console.log(this.work);
      let _this = this;
      this.$router.push({
        name: "doWork",
        params: { wid: myWork.id, wname: myWork.workName, cid: _this.cid },
      });
    },
    dataURLtoFile(dataUrl, fileName) {
      var arr = dataUrl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], fileName, { type: mime });
    },
    checkFace() {
      let _this = this;
      this.getValidate = false;
      this.canvas = document.getElementById("canvas");
      this.video = document.getElementById("video");
      this.canvas.getContext("2d").drawImage(this.video, 0, 0, 400, 300);
      this.tackPhoto = false;
      this.loading = true;
      let dataurl = this.canvas.toDataURL("image/jpeg");
      let formData = new FormData();
      formData.append("file", this.dataURLtoFile(dataurl, "face.jpeg")); //图片内容
      this.submtiFace = true;
      _axios
        .post("/api/upload/checkFace", formData)
        .then((res) => {
          let data = res.data;
          let code = data.code;
          _this.facecheck_msg = data.msg;
          if (Number(code) == 1) {
            // 验证不通过
            _this.facecheck_color = "red";
            _this.pass_facecheck = false;
            _this.loading = false;
            _this.getValidate = true;
            var img = new Image();
            img.src = "error.png";
            img.onload = function () {
              _this.canvas.getContext("2d").clearRect(0, 0, 400, 400);
              _this.canvas.getContext("2d").drawImage(img, 0, 0, 380, 380);
            };
          } else {
            _this.facecheck_color = "green";
            _this.pass_facecheck = true;
            _this.loading = false;
            _this.getValidate = true;
            var img = new Image();
            img.src = "success.png";
            img.onload = function () {
              _this.canvas.getContext("2d").clearRect(0, 0, 400, 400);
              _this.canvas.getContext("2d").drawImage(img, 0, 0, 380, 380);
            };
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    // 摄像头
    this.video = document.getElementById("video");
    this.canvas = document.getElementById("canvas");
  },
  created() {
    let _this = this;
    this.loading = true;
    this.getValidate = false;
    token = window.localStorage.getItem("token");
    // init axios
    _axios.interceptors.request.use(function (config) {
      config.headers = {
        Authorization: token,
      };
      return config;
    });
    const form = new FormData();
    form.append("wid", _this.work.id);
    _axios
      .post("/api/Exam/getExamRulePre", form)
      .then((res) => {
        _this.rules = res.data.data;
        _this.tab_num = 0;
        _this.rules.rules = _this.rules.rules.slice(1, -1).split(",");
        if (_this.rules.rules.includes("FACECHECK")) {
          _this.facecheck = true;
          _this.tab_num++;
        }
        _this.getValidate = true;
        _this.loading = false;
      })
      .catch((err) => {
        console.error(err);
        _this.getValidate = true;
        _this.loading = false;
      });
  },
};
</script>

<style></style>
