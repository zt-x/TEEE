<template>
  <v-card ripple hover class="my-1 mx-auto" style="width: 95%">
    <v-container>
      <v-row>
        <v-col cols="2">{{ SUBMIT.username }}</v-col>
        <v-col cols="2">{{ SUBMIT.uid }}</v-col>
        <v-col cols="8">
          <v-spacer></v-spacer>
          <v-chip :color="score_color" small>{{ SUBMIT.score }}</v-chip>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
	props: ["SUBMIT"],
	computed: {
		score_color() {
			return this.SUBMIT.score > 60 ? (this.SUBMIT.score > 80 ? "success" : "warning") : "error";
		}
	}
};
</script>

<style></style>
