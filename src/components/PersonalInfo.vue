<template>
  <v-card :loading="!gotInfo">
    <v-card-title class="headline">
      <span style="color: #757575"> 个人信息 </span>
      <v-spacer></v-spacer>
      <v-chip class="ml-2" small color="red" @click="close('close')"> </v-chip>
    </v-card-title>
    <v-card-text class="mt-3">
      <v-tabs-items v-model="tabs_takeFace">
        <v-tab-item>
          <v-list-item>
            <v-list-item-avatar color="grey">
              <v-img :src="avatar"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="headline"
                >{{ username }}
                <v-chip small @click="tabs_takeFace = 1">
                  <v-icon color="success" class="mr-1" small v-if="haveFace"
                    >fa fa-check-circle</v-icon
                  >
                  <v-icon color="error" class="mr-1" small v-if="!haveFace"
                    >fa fa-close</v-icon
                  >
                  {{ haveFace == true ? "已录入人脸" : "未录入人脸，点击开始录制" }}
                </v-chip>
              </v-list-item-title>
              <v-list-item-subtitle> {{ uid }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-tab-item>
        <!-- 录入人脸-->
        <v-tab-item>
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <div class="mx-auto" v-if="!submtiFace">
                  请打开浏览器摄像头权限, 面对摄像头
                </div>
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
        text
        v-if="tabs_takeFace == 1"
        @click="
          tabs_takeFace = 0;
          tackPhoto = false;
        "
        dark
        color="blue lighten-1"
        >返回上一页</v-btn
      >
      <v-btn
        :disabled="!gotInfo"
        v-if="tabs_takeFace == 1"
        @click="subFace"
        dark
        color="blue lighten-1"
        >拍照提交</v-btn
      >
      <v-btn
        text
        :disabled="!gotInfo"
        v-if="tabs_takeFace == 1"
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
      gotInfo: false,
      username: "",
      uid: "",
      avatar: "",
      role: "",
      haveFace: false,
      tabs_takeFace: 0,
      submtiFace: false,
      // Camara
      canvas: null,
      video: null,
      mediaStreamTrack: "",
      tackPhoto: false,
      fMode: "user",
      //loading
      loading: true,
      loadingText: "",
    };
  },
  methods: {
    flush() {
      this.gotInfo = false;
      token = window.localStorage.getItem("token");
      _axios.interceptors.request.use(function (config) {
        config.headers = {
          Authorization: token,
        };
        return config;
      });
      let _this = this;
      _axios
        .post("/api/power/getInfo")
        .then((res) => {
          if (Number(res.data.code) == 1) {
            alert(res.data.msg);
            _this.close();
            return;
          }
          let data = JSON.parse(res.data.data);
          console.log(res.data.data);
          console.log(data);

          _this.uid = data.uid;
          _this.username = data.username;
          _this.role = data.role;
          _this.avatar = data.avatar;
          _this.gotInfo = true;
          _this.haveFace = data.face == "yes" ? true : false;
        })
        .catch((err) => {});
    },
    close(value) {
      this.$emit("closeInfo");
    },

    // COPY
    changeCamara() {
      this.tackPhoto = false;
      if (this.fMode == "user") {
        this.fMode = "environment";
      } else {
        this.fMode = "user";
      }
      this.tackPhoto = true;
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
    subFace() {
      let _this = this;
      this.gotInfo = false;
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
        .post("/api/upload/uploadFacePic", formData)
        .then((res) => {
          let data = res.data;
          let code = data.code;
          if (Number(code) == 1) {
            console.error(data);
            alert(data);
          } else {
            _this.flush();
            _this.tabs_takeFace = 0;
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
  mounted() {
    this.flush();
  },
};
</script>

<style></style>
