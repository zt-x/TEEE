<template>
	<v-card
		class="mx-auto"
		max-width="300"
		min-width="100"
		max-height="300px"
		:hover="hover"
		ripple
	>
		<v-img
			class="white--text align-end"
			height="100px"
			:src="Course.IMG"
		>
			<v-card-title v-text="Course.Name"></v-card-title>
		</v-img>

    	<v-card-subtitle class="pb-0" v-text="Course.TeacherName"></v-card-subtitle>

		<v-card-text style="font-size:small">
			<!-- <div>Whitehaven Beach</div>
			<div>Whitsunday Island, Whitsunday Islands</div> -->
			<div class="text--secondary">{{Course.College}}</div>

			<div>{{Course.Time}}</div>
		</v-card-text>

		<v-card-actions>
			<v-btn
				color="orange"
				text
			>
				进入课程
			</v-btn>

			<v-btn
				color="orange"
				text
			>
				查看统计
			</v-btn>
		</v-card-actions>
  	</v-card>
</template>

<script>
export default {
	props: ['Course'],
	data: () => ({
		hover: true,
	}),
}
</script>

<style>

</style>