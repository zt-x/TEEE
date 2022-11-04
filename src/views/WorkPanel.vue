<template>
  <v-card style="min-width:1520px;">
	<v-card-title>666</v-card-title>
	<v-card-text>
		<v-container fluid>
			<v-row>
				<!-- 答题卡 -->
				<v-col cols="3">
					<v-card > 
						<v-card-title>答题卡</v-card-title>
						<v-divider></v-divider>
						<v-container fluid>
							<v-row>
								<v-col cols="12">
									<div style="height:5px"></div>
									<v-card class="mx-auto">
										<v-card-title>这里是题号区</v-card-title>
									</v-card>
								</v-col>
							</v-row>
						</v-container>

					</v-card>
				</v-col>
				<!-- 答题区 -->
				<v-col cols="9">
					<v-card min-width="500px">
						<v-card-title>作答区</v-card-title>
						<v-divider></v-divider>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-card-text>

  </v-card>
</template>

<script>
export default {

}
</script>

<style>

</style>