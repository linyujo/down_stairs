<template>
	<div class="single-view">
		<div class="single-view-bg"></div>
		<Playground />
	</div>
</template>

<script>
import Playground from "@/components/DownStairs/SingleGame.vue";

export default {
	components: {
		Playground: Playground
	}
};
</script>

<style lang="scss" scoped>
.single-view {
	height: 100%;
}
.single-view-bg {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: #272727;
}
</style>
