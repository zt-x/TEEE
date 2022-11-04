<template>
  <v-app>
    <v-main>
      <router-view style="overflow-x: auto" />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    //
  }),
};
</script>

<style>
.v-main__wrap{
	overflow: auto;
}
</style>