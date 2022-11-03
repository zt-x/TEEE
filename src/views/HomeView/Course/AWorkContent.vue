<template>
  <v-container fluid>
	<v-row>
      <!-- Submitted WorkPlace -->
      <v-col cols="12" sm="8">
		<v-card>
			<v-tabs v-model="tab" background-color="transparent" color="basil">
				<v-tab>
					<v-chip color="warning" small>111</v-chip>
					<span class="pl-2">未批改</span>
				</v-tab>	
				<v-tab>
					<v-chip small color="success">12</v-chip>
					<span class="pl-2">已批改</span>
				</v-tab>
			</v-tabs>
			<v-tabs-items v-model="tab">
				<v-tab-item>
					<v-card color="basil" flat>

					</v-card>
				</v-tab-item>
				<v-tab-item>
					<v-card color="basil" flat>

					</v-card>
				</v-tab-item>
			</v-tabs-items>
        </v-card>
	  </v-col>
	  <!-- Statistic -->
      <v-col cols="12" sm="4">
		<v-card>
			<v-card-title>111</v-card-title>
		</v-card>
	  </v-col>
	</v-row>	
  </v-container>
</template>

<script>
export default {
	data() {
		return {
			tab: null,
			items: ['未批改', '已批改'],
		}
	}
}
</script>

<style>

</style>