<template>
  <v-container fluid style="background-color: red">
	<v-row>
		<!-- Course WorkPlace -->
		<v-col cols="12" sm="8">
			<v-card> 
				<v-tabs v-model="tabs" centered>
					<v-tab>作业</v-tab>
					<v-tab>考试</v-tab>
					<v-tab>公告</v-tab>
				</v-tabs>
			</v-card>			
		</v-col>
		<!-- Course Info -->
		<v-col cols="12" sm="4">
			<v-card>123</v-card>
		</v-col>
	</v-row>

  </v-container>
</template>

<script>
export default {
	data() {
		return {
			tabs:3,
		}
	}
};
</script>

<style></style>
