<template>
  <v-container>
    <v-card v-for="work in works" v-bind:key="work.id" style="min-width: 100%" hover>
      <v-card-title>
        {{work.workName}}
        <v-spacer></v-spacer>
        <v-chip small class="ma-2" color="green" text-color="white"> 已完成 </v-chip>
      </v-card-title>
      <v-card-subtitle>123</v-card-subtitle>
    </v-card>

  </v-container>
</template>

<script>


export default {
  props: ["works"],
  data() {
	  return {

	};
  },
	created() {

    }
};
</script>

<style></style>
