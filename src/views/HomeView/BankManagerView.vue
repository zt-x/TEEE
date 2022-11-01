<template>
    <v-container fluid>
		<v-overlay :value="prepareing_overlay">
		<v-chip>
			<v-progress-circular indeterminate size="16" class="mr-3"></v-progress-circular>
			<v-spacer></v-spacer>
			<span>正在加载库功能 ...</span>
		</v-chip>
		</v-overlay>
	</v-container>
</template>

<script>
export default {
	data() {
		return {
			prepareing_overlay: true,
		}
	}
}
</script>

<style>

</style>