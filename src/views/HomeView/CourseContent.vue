<template>
  <v-container fluid style="background-color: red">
	<v-row>
		<!-- Course WorkPlace -->
		<v-col cols="12" sm="8">
			<v-card> 
				<v-tabs
					v-model="tab"
					background-color="transparent"
					color="basil"
					>
					<v-tab
						v-for="item in items"
						:key="item"
					>
						{{ item }}
					</v-tab>
					</v-tabs>

					<v-tabs-items v-model="tab">
					<v-tab-item
						v-for="item in items"
						:key="item"
					>
						<v-card
						color="basil"
						flat
						>
						<v-card-text>{{ text }}</v-card-text>
						</v-card>
					</v-tab-item>
					</v-tabs-items>
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
			tab: null,
        items: [
          '作业', '考试', '公告'
        ],
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
		}
	}
};
</script>

<style></style>
