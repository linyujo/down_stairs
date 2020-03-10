<template>
	<div class="dual-view">
		<div class="dual-view-bg"></div>
		<Playground />
	</div>
</template>

<script>
/* eslint-disable */
import Playground from "@/components/DownStairs/DualGame.vue";

export default {
	components: {
		Playground: Playground,
	},
}

</script>

<style lang="scss" scoped>
.dual-view {
	height: 100%;
}
.dual-view-bg {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: #272727;
}
</style>