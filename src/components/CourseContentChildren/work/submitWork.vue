<template>
  <v-card class="my-1 mx-auto" style="width: 95%">
    <v-container>
      <v-row>
        <v-col cols="2">{{ INFO.name }}</v-col>
        <v-col cols="2">{{ INFO.username }}</v-col>
        <v-col cols="8">
          <v-spacer></v-spacer>
          <v-chip color="warning" small>{{ INFO.score }}</v-chip>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  props: ["INFO"],
};
</script>

<style></style>
