<template>
  <v-card>
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
import CKEditor from "ckeditor4-vue";

export default {
  components: { ckeditor: CKEditor.component },

  data() {
    return {
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
    close() {
      this.ans_score = "";
      this.ans_text = "";
      this.files = [];
      this.msg = "";
      this.$emit("closeAddTextQue", false);
    },
    add() {
      // 返回JSON
      // {qtype: 30012, qscore: 2.0,
      // qtext: "1111", cans: ""}
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
      let newQue = {};
      newQue.qtype = 30012;
      newQue.qscore = this.ans_score;
      newQue.qtext = this.ans_text;
      newQue.qfiles = this.filesRealPath;
      //上传附件

      //
      this.ans_score = "";
      this.ans_text = "";
      this.msg = "";
      this.$emit("addTextQue", newQue);
    },
  },
};
</script>

<style></style>
