<template>
	<v-card>
		<v-card-title>666</v-card-title>
		<v-container>
			<v-btn @click="close()">close</v-btn>
			

		</v-container>
	</v-card>
</template>

<script>
import axios from "axios";
let token = window.localStorage.getItem("token");
export default {
	props: ["sid"],
	methods: {
		close() {
			this.$emit("closeSubmitCard", false);
		},
	}
}
</script>

<style>

</style>