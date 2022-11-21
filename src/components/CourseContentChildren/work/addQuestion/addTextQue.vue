<template>
  <v-card>
    <v-snackbar
      v-model="snackbar"
      v-if="snackbar"
      top
      :color="snackbar_color"
      dense="true"
      timeout="2000"
    >
      {{ snackbar_msg }}
    </v-snackbar>
    <v-card-title>添加简答题</v-card-title>
    <v-container>
      <v-row>
        <v-col cols="12">
          <ckeditor
            v-model="ans_text"
            :config="editorConfig"
            editor-url="/ckeditor/ckeditor.js"
          ></ckeditor>
        </v-col>
        <!-- 添加附件 -->
        <v-col cols="12">
          <v-file-input
            dense
            v-model="files"
            color="deep-purple accent-4"
            multiple
            placeholder="点击选择添加附件"
            prepend-icon="mdi-paperclip"
            outlined
            @change="sout(files)"
          >
            <template v-slot:selection="{ index, text }">
              <v-chip
                close
                v-if="index < 3"
                color="deep-purple accent-4"
                dark
                label
                small
                @click:close="files.splice(index, 1)"
              >
                {{ text }}
              </v-chip>

              <span
                v-else-if="index === 3"
                class="overline grey--text text--darken-3 mx-2"
              >
                +{{ files.length - 3 }} File(s)
              </span>
            </template>
          </v-file-input>
        </v-col>
      </v-row>
    </v-container>
    <v-card-actions>
      <div style="width: 100px">
        <v-text-field
          label="分值"
          dense
          hint="请输入一个整数或Float"
          v-model="ans_score"
        ></v-text-field>
      </div>
      <v-spacer></v-spacer>

      <span class="red--text">{{ this.msg }}</span>
      <v-spacer></v-spacer>

      <v-btn color="green darken-1" text @click="close()">算了</v-btn>
      <v-btn
        :loading="loading_upload"
        color="green darken-1"
        min-width="60px"
        class="white--text"
        @click="add()"
        >添加</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from "axios";
import CKEditor from "ckeditor4-vue";
let token = window.localStorage.getItem("token");
export default {
  components: { ckeditor: CKEditor.component },

  data() {
    return {
      snackbar: false,
      snackbar_color: "success",
      snackbar_msg: "",
      loading_upload: false,
      files: [],
      filesRealPath: [],
      ans_score: "",
      ans_text: "",
      editorConfig: {
        removePlugins: "easyimage",
        extraPlugins: "image2,uploadimage",
        uploadUrl: "/api/upload/img",
        // filebrowserBrowseUrl: "/api/upload/img",
        filebrowserImageBrowseUrl: "/api/upload/img",
        // filebrowserUploadUrl: "/api/upload/img",
        filebrowserImageUploadUrl: "/api/upload/img",
        removeButtons:
          "Save,NewPage,ExportPdf,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Scayt,SelectAll,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,CopyFormatting,RemoveFormat,Outdent,Indent,Blockquote,CreateDiv,BidiLtr,BidiRtl,Language,Link,Unlink,Anchor,Table,PageBreak,Iframe,ShowBlocks,About,Source",
        toolbarGroups: [
          { name: "document", groups: ["mode", "document", "doctools"] },
          { name: "clipboard", groups: ["clipboard", "undo"] },
          { name: "editing", groups: ["find", "selection", "spellchecker", "editing"] },
          { name: "forms", groups: ["forms"] },
          { name: "basicstyles", groups: ["basicstyles", "cleanup"] },
          "/",
          {
            name: "paragraph",
            groups: ["list", "indent", "blocks", "align", "bidi", "paragraph"],
          },
          { name: "links", groups: ["links"] },
          { name: "insert", groups: ["insert"] },
          { name: "styles", groups: ["styles"] },
          { name: "colors", groups: ["colors"] },
          { name: "tools", groups: ["tools"] },
          { name: "others", groups: ["others"] },
          { name: "about", groups: ["about"] },
        ],
      },
      rules: {
        required: (value) => !!value || "不能为空！",
      },
      msg: "",
    };
  },
  methods: {
    sout(val) {
      console.log(val);
    },
    close() {
      this.ans_score = "";
      this.ans_text = "";
      this.files = [];
      this.msg = "";
      this.$emit("closeAddTextQue", false);
    },
    add() {
      let _this = this;
      if (this.ans_score == "") {
        this.msg = "分值不能为空";
        return;
      } else if (this.ans_text == "") {
        this.msg = "题目内容不能为空";
        return;
      } else if (isNaN(this.ans_score)) {
        this.msg = "请输入一个正确的分数!";
        return;
      }
      token = window.localStorage.getItem("token");
      let param = new FormData();
      for (let i in this.files) {
        param.append("file", this.files[i]);
      }
      this.loading_upload = true;
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      };
      axios
        .post("/api/upload/file", param, config)
        .then((res) => {
          if (res.data.code == 1) {
            // 上传失败
            _this.snackbar_msg = res.data.msg;
            _this.snackbar_color = "error";
            _this.snackbar = true;
            console.log(_this.snackbar_color);
            return;
          } else {
            _this.snackbar_msg = res.data.msg;
            _this.snackbar_color = "success";
            _this.snackbar = true;
            console.log(_this.snackbar_color);

            //   解析 获得 FileRealPath
            // _this.filesRealPath
            console.log(res.data.data);
            // 返回JSON
            // {qtype: 30012, qscore: 2.0,
            // qtext: "1111", cans: "",files:""}

            let newQue = {};
            newQue.qtype = 30012;
            newQue.qscore = this.ans_score;
            newQue.qtext = this.ans_text;
            console.log(eval(res.data.data));
            newQue.qfiles = eval(res.data.data);
            //上传附件

            //
            this.ans_score = "";
            this.ans_text = "";
            this.msg = "";
            this.$emit("addTextQue", newQue);
            _this.loading_upload = false;
          }
        })
        .catch((err) => {
          _this.snackbar_color = "error";
          _this.snackbar_msg = err;
          _this.loading_upload = false;
        });
      // return;
    },
  },
};
</script>

<style></style>
