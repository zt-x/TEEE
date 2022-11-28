<template>
  <v-card class="mx-auto" width="800px">
    <v-card-title>欢迎使用Admin的临时注册机😍</v-card-title>
    <v-card-text>
      <v-container fluid>
        <v-row align="center">
          <v-col cols="6">
            <!-- 学号 -->
            <v-text-field label="学号" v-model="uid"></v-text-field>
          </v-col>
          <v-col cols="6">
            <!-- 用户名 -->
            <v-text-field label="姓名" v-model="uname"></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-avatar color="#e5f1ff">
              <v-img :src="avatar" width="40px"></v-img>
            </v-avatar>
          </v-col>
          <v-col cols="5">
            <v-text-field label="头像" v-model="avatar"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-select :items="items" v-model="role" label="身份"></v-select>
          </v-col>
          <v-col cols="6">
            <v-text-field label="密码2" v-model="pwd"></v-text-field>
          </v-col>
          <v-col cols="6"></v-col>
          <v-col cols="6"></v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="success" @click="register()">注册</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      uid: "",
      uname: "",
      role: "",
      avatar: "",
      items: ["student", "teacher"],
      pwd: "",
    };
  },
  methods: {
    setUserInfo() {
      let json = {};
      json.uid = this.uid;
      json.username = this.uname;
      json.avatar = this.avatar;
      axios.put("/api/register", json).then((res) => {
        alert(res.data.msg);
      });
    },
    register() {
      let json = {};
      json.uid = this.uid;
      json.pwd = this.pwd;
      json.role = this.role;
      let _this = this;
      axios.post("/api/register", json).then((res) => {
        if (Number(res.data.code) == 20011) {
          _this.setUserInfo();
        } else {
          alert(res.data.msg);
        }
      });
    },
  },
};
</script>

<style></style>
