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
              <v-col cols="12"
                ><div class="mx-auto">请打开浏览器摄像头权限, 面对摄像头</div></v-col
              >
            </v-row>
            <v-row align="center">
              <v-avatar size="300" class="mx-auto">
                <video v-if="tackPhoto" id="video" width="400" height="400"></video>
                <canvas
                  id="canvas"
                  v-if="!tackPhoto"
                  width="400"
                  height="400"
                  style="display: block; background: grey"
                ></canvas>
              </v-avatar>
            </v-row>
            <v-row>
              <v-btn @click="takePhoto">1</v-btn>
            </v-row>
          </v-container>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="!getValidate"
        v-if="tabs_validate == 0"
        @click="
          tabs_validate += tabs_validate < tab_num ? 1 : 0;
          tackPhoto = true;
        "
        dark
        color="blue lighten-1"
        >开始验证</v-btn
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
      immediate: true,
      handler(newVal) {
        //监听接收到拍摄状态后，开始调取摄像头权限。如果功能是在一个组件里面，下面步骤可以直接写在自己的触发方法里面
        if (newVal) {
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
            video: { facingMode: "environment" }, // 或者 "user"
            // video: { width: 1280, height: 720 }
            // video: { facingMode: { exact: "environment" } }// 或者 "user"
          };

          let that = this;
          navigator.mediaDevices
            .getUserMedia(mediaOpts)
            .then(function (stream) {
              that.mediaStreamTrack = stream;
              video = document.querySelector("video");
              console.log(video);
              if ("srcObject" in video) {
                video.srcObject = stream;
              } else {
                video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
              }
              video.play();
            })
            .catch(function (err) {
              console.log(err);
            });
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

      // Camara
      loadingbut: false,
      preViewVisible: false,
      blobFile: null,
      canvas: null,
      video: null,
      mediaStreamTrack: "",
      tackPhoto: false,
    };
  },
  methods: {
    close() {
      this.tackPhoto = false;
      this.$emit("close");
    },
    enterWork(myWork) {
      let _this = this;
      this.$router.push({
        name: "doWork",
        params: { wid: myWork.id, wname: myWork.workName, cid: _this.cid },
      });
    },
    takePhoto() {
      this.canvas.getContext("2d").drawImage(this.video, 0, 0, 400, 300);
    },
  },
  mounted() {
    // 摄像头
    this.video = document.getElementById("video");
    this.canvas = document.getElementById("canvas");
  },
  created() {
    let _this = this;
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
      })
      .catch((err) => {
        console.error(err);
        _this.getValidate = true;
      });
  },
};
</script>

<style></style>
