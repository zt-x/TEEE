<template>
  <v-card>
    <v-card-title class="font-weight-black brown--text">
      发布公告
      <v-spacer></v-spacer>
      <v-chip small color="grey" @click="close('minus')">
        <!--最小化  -->
      </v-chip>
      <v-chip class="ml-2 openTrans two" small color="red" @click="close('close')">
        <!-- 关闭 -->
      </v-chip>
    </v-card-title>
    <v-card-text>
      <v-container fluid>
        <v-row>
          <v-col cols="2">
            <v-select hide-details solo dense :items="items" label="类型"></v-select
          ></v-col>
          <v-col cols="10">
            <v-text-field
              hide-details
              label="标题"
              placeholder="Placeholder"
              dense
              solo
            ></v-text-field
          ></v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card style="padding: 5px">
              <ckeditor
                v-model="content"
                :config="editorConfig"
                editor-url="/ckeditor/ckeditor.js"
              ></ckeditor>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <!-- <v-spacer></v-spacer> -->
      <v-container fluid>
        <v-row>
          <v-col cols="10">
            <v-row justify="begin">
              <v-checkbox
                dense
                class="mt-0 ml-5"
                hide-details
                label="推送给班级所有成员"
                v-model="isSendToStu"
              ></v-checkbox>
            </v-row>
          </v-col>
          <v-col cols="2">
            <v-row justify="end">
              <v-btn color="green darken-1" text @click="close()">算了</v-btn>
              <v-btn
                color="green darken-1"
                min-width="60px"
                class="white--text"
                @click="beforeReleaseWork()"
                >发布</v-btn
              >
            </v-row>
          </v-col>
        </v-row>
      </v-container>
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
      items: ["重要", "一般"],
      content: "",
      title: "",
      type: "",
      isSendToStu: false,
      /*
       *
       *  Config
       *
       */
      editorConfig: {
        removePlugins: "image,easyimage,cloudservices,exportpdf",
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
    };
  },
  methods: {
    close(param) {
      //   if (param == "close") {
      //     this.workTitle = "";
      //     this.totalScore = "";
      //     this.timeLimit = "";
      //     this.TimeMenu = "";
      //     this.deadline = "";
      //     this.releaseWork_isExam = false;
      //     this.workContentRadio = "";
      //     this.questions = [];
      //     this.wb = "";
      //     this.files = [];
      //   }
      this.$emit("close", true);
    },
  },
};
</script>

<style></style>
