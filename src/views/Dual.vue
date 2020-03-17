<template>
	<div class="dual-view">
		<div class="dual-view-bg"></div>
		<Playground v-if="roomID" :resetRoomID="resetRoomID" />
		<div v-else class="instruction">
			Invite instruction
		</div>
	</div>
</template>

<script>
/* eslint-disable */
import sidebarStatus from "@/store/modules/sidebarStatus";
import Playground from "@/components/DownStairs/DualGame.vue";
import socket from "@/socket";

export default {
	components: {
		Playground: Playground,
	},
	data: function(){
		return {
			roomID: null,
		};
	},
	mounted: function() {
		socket.on("BATTLE_ROOM_ID", payload => {
			this.roomID = payload.roomID
		});
	},
	methods: {
		resetRoomID: function() {
			setTimeout(() => {
				this.roomID = null;
			}, 10000);
			this.$store.dispatch(sidebarStatus.actionTypes.RESET_IDLE);
		}
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
.instruction{
	color: white;
}
</style>