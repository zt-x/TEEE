<template>
  <v-card @click="showSubmitCard()" ripple hover class="my-1 mx-auto" style="width: 95%">
    <v-dialog persistent width="600px" v-model="showCard">
      <StuAns
        @closeSubmitCard="closeSubmitCard($event)"
        v-if="showCard"
        :SUBMIT="SUBMIT"
        :qscores="qscores"
      />
    </v-dialog>
    <v-container>
      <v-row>
        <v-col cols="2" class="hideMore">
          <v-avatar class="mr-1" size="30px">
            <v-img :src="SUBMIT.avatar"></v-img>
          </v-avatar>
          {{ SUBMIT.username }}
        </v-col>
        <v-col cols="2">{{ SUBMIT.uid }}</v-col>
        <v-col cols="6">
          <v-spacer></v-spacer>
        </v-col>
        <v-col cols="2">
          <v-chip :color="score_color" small>{{ SUBMIT.score.toFixed(1) }}</v-chip>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import StuAns from "@/components/CourseContentChildren/stuAns.vue";
import axios from "axios";
const _axios = axios.create();
let token = window.localStorage.getItem("token");

export default {
  props: ["SUBMIT", "qscores"],
  components: { StuAns },
  computed: {
    score_color() {
      return this.SUBMIT.score > 60
        ? this.SUBMIT.score > 75
          ? this.SUBMIT.score > 90
            ? "success"
            : "info"
          : "warning"
        : "error";
    },
  },
  data() {
    return {
      img_src:
        "https://img1.baidu.com/it/u=592570905,1313515675&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1668186000&t=934cb8891f34756eedcaf478b7111ee9",
      sid: 0,
      showCard: false,
    };
  },
  methods: {
    showSubmitCard() {
      this.sid = this.SUBMIT.id;
      this.showCard = true;
    },
    closeSubmitCard(val) {
      this.showCard = false;
      this.$emit("flushSubmit", true);
    },
  },
};
</script>

<style>
.hideMore {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
