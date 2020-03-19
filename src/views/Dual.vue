<template>
	<div class="dual-view">
		<div class="dual-view-bg"></div>
		<Playground
			key="game"
			v-if="roomID"
			:resetAllStatusToIdle="resetAllStatusToIdle"
			:roomID="roomID"
		/>
		<div v-else key="instruction" class="instruction" ref="instruction">
			<div class="instruction-content">
				雙人模式，需要同時有兩人在線上，才可進行遊戲。<br />
				請先在右邊的「在線成員」欄，點選一個「閒置中」的在線成員。<br />
				<img
					:src="inviteDemo1"
					class="inviteDemo1"
					alt="邀請在線成員1"
				/><br />
				點選成員後，請選擇 YES 召喚該成員一同進行遊戲。<br />
				<img
					:src="inviteDemo2"
					class="inviteDemo2"
					alt="邀請在線成員2"
				/><br />
				並在30秒內等候該成員的回覆。<br />
				若該玩家在30秒內同意邀請，遊戲即立刻開始。<br />
			</div>
			<FlashLight
				:appendWidth="instructionWidth"
				:appendHeight="instructionHeight"
			/>
		</div>
	</div>
</template>

<script>
/* eslint-disable */
import sidebarStatus from "@/store/modules/sidebarStatus";
import user from "@/store/modules/user";
import Playground from "@/components/DownStairs/DualGame.vue";
import FlashLight from "@/components/FlashLight";
import socket from "@/socket";

export default {
	components: {
		Playground: Playground,
		FlashLight: FlashLight
	},
	data: function(){
		return {
			roomID: null,
			inviteDemo1: require("@/assets/instructions/inviteDemo1.png"),
			inviteDemo2: require("@/assets/instructions/inviteDemo2.png"),
			instructionWidth: 0,
			instructionHeight: 0
		};
	},
	mounted: function() {
		this.instructionWidth = this.$refs.instruction.offsetWidth;
		this.instructionHeight = this.$refs.instruction.offsetHeight;

		socket.on("BATTLE_ROOM_ID", payload => {
			this.roomID = payload.roomID;
		});
	},
	beforeDestroy: function() {
		socket.off("BATTLE_ROOM_ID");
	},
	methods: {
		resetAllStatusToIdle: function() {
			setTimeout(() => {
				this.roomID = null;
				this.$store.dispatch(sidebarStatus.actionTypes.RESET_IDLE);
			}, 3000);
		}
	},
	
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
	background: #fefefe;
	height: 100%;;
}
.instruction-content{
	top: 50%;
	transform: translateY(-50%);
	color: black;
	font-size: 1em;
	line-height: 1.5em;
	.inviteDemo1{
		margin: 16px 0;
	}
	.inviteDemo2{
		margin: 14px 0;
	}
}
</style>