<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    color="#a36645"
    :mini-variant="mini_variant"
    mini-variant-width="80"
    permanent
  >
    <div v-if="!mini_variant" class="d-block text-center mx-auto mt-5 mb-16">
      <v-img src="LOG2.jpg" />
    </div>
    <v-avatar v-else class="d-block text-center mx-auto mt-5 mb-16" size="40">
      <v-img src="logo.png" />
    </v-avatar>
    <v-spacer></v-spacer>
    <v-list flat style="margin-top: 150px; margin-bottom: 200px">
      <v-list-item-group v-model="selectedItem" color="primary">
        <v-list-item
          input-value="true"
          v-for="(item, i) in items"
          v-bind:key="i"
          active-class="border"
          :ripple="false"
          @click="changePage(item.path)"
        >
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-list-item-icon v-bind="attrs" v-on="on">
                <v-icon color="white">{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <!-- <v-list-item-content class="white--text">{{
                item.name
              }}</v-list-item-content> -->
            </template>
            <span>{{ item.name }}</span>
          </v-tooltip>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <div
      style="
        position: absolute;
        bottom: 20px;
        margin-left: auto;
        margin-right: auto;
        left: 0;
        right: 0;
        text-align: center;
      "
    >
      <v-icon color="white" class="mb-5">fas fa-cog</v-icon>
      <br />
      <v-icon color="white" @click="aboutUS()" hover>fas fa-info-circle</v-icon>
    </div>
  </v-navigation-drawer>
</template>

<script>
export default {
  data: () => ({
    aboutView: false,
    mini_variant: true,
    selectedItem: 2,
    drawer: null,
    items: [
      // {icon: "fas fa fa-list-alt",name:'我的课程', path:'/Course'},
      // {icon: "fas fa-bar-chart",name:'数据统计', path:'/Statistics'},
      // {icon: "fas fa-bar-chart",name:'数据统计2', path:''},
    ],
    src_logo: {
      small: "logo.png",
      big: "LOG2.jpg",
      small_size: 30,
      big_size: 60,
    },
  }),
  methods: {
    aboutUS() {
      this.mini_variant = !this.mini_variant;
    },
    changePage(url) {
      this.$router.push(url).catch((err) => {
        if (
          err.message.indexOf("Avoided redundant navigation to current location") == -1
        ) {
          this.$router.push("/404");
        }
      });
    },
  },

  created() {},
  mounted() {
    this.items = JSON.parse(sessionStorage.getItem("serverRoutes"));
    this.items = this.items.filter((item) => {
      return item.hide == "true";
    });
  },
};
</script>

<style scoped>
.border {
  background-color: #b97a57;
  margin-left: 12px;
  margin-right: 12px;
  border-radius: 50%;
  text-decoration: none;
}
.v-list-item-group .v-list-item--active {
  color: white !important;
}
/* .v-list-item {
  margin: 12px;
  text-decoration: none;
}
.v-list-item:hover {
  background: #b97a57;
  transition: background 0.7s;
} */
</style>
