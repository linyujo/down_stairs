<template>
	<div class="dual-view">
		<div class="dual-view-bg"></div>
		<Playground v-if="roomID" />
		<div v-else class="instruction">
			Invite instruction
		</div>
	</div>
</template>

<script>
/* eslint-disable */
import Playground from "@/components/DownStairs/DualGame.vue";
import socket from "@/socket";

export default {
	components: {
		Playground: Playground,
	},
	data: function(){
		return {
			roomID: "123_temp",
		};
	},
	mounted: function() {
		socket.on("BATTLE_ROOM_ID", payload => {
			this.roomID = payload.roomID
		});
	}
}

</script>

<style lang="scss" scoped>
.dual-view {
	height: 100%;
	.instruction{
		color: white;
	}
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