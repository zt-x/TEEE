<template>
  <div class="camera-box" style="width: 900px">
    <v-row>
      <v-col>
        <div
          style="
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
            background: red;
          "
        >
          摄像头
        </div>
        <!-- 这里就是摄像头显示的画面 -->
        <video id="video" width="400" height="300"></video>
        <div class="iCenter">
          <v-btn type="primary" size="small" @click="takePhone" style="margin-top: 10px"
            >拍照</v-btn
          >
        </div>
      </v-col>
      <v-col cols="12">
        <div
          style="
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
          "
        >
          拍摄效果
        </div>
        <!-- 这里是点击拍照显示的图片画面 -->
        <canvas id="canvas" width="400" height="300" style="display: block"></canvas>
        <v-btn
          :loading="loadingbut"
          type="primary"
          size="small"
          @click="takePhoneUpfile"
          style="margin-top: 10px"
          >保存</v-btn
        >
      </v-col>
    </v-row>
  </div>
</template>
<script>
// import { putFileAttach } from "@/api/customer/animalinfo";
export default {
  props: {
    tackPhoto: {
      //父组件传过来的状态
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      loadingbut: false,
      preViewVisible: false,
      blobFile: null,
      canvas: null,
      video: null,
      mediaStreamTrack: "",
    };
  },
  watch: {
    tackPhoto: {
      immediate: true,
      handler(newVal) {
        //监听接收到拍摄状态后，开始调取摄像头权限。如果功能是在一个组件里面，下面步骤可以直接写在自己的触发方法里面
        if (newVal) {
          var video = document.querySelector("video");
          var text = document.getElementById("text");
          // var mediaStreamTrack;

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
  mounted() {
    // 摄像头
    this.video = document.getElementById("video");
    //画布
    this.canvas = document.getElementById("canvas");
  },
  methods: {
    /**
     * DataUrl转为File
     * @param {String} dataUrl - dataUrl地址
     * @param {String} fileName - file文件名
     */
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
    takePhone() {
      //点击拍照截图画面
      let that = this;
      that.canvas.getContext("2d").drawImage(this.video.childNodes[0], 0, 0, 400, 300);
      let dataurl = that.canvas.toDataURL("image/jpeg");
      //   that.blobFile = that.dataURLtoFile(dataurl, "camera.jpg");
      that.preViewVisible = true;
    },
    takePhoneUpfile() {
      //保存图片
      this.loadingbut = true;
      let formData = new FormData();
      formData.append("file", this.blobFile); //图片内容
    },
  },
};
</script>
<style>
.camera-box #canvas {
  border: 1px solid #dcdfe6;
}
</style>
