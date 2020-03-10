<template>
	<div class="invited">
		<div class="username">{{ inviter.username }}</div>
		想與你<br />
		來一場激烈的決鬥
		<div class="btn-gruop">
			<button @click="challengeAccepted" class="text-btn accept">
				接受
			</button>
			<button @click="decline" class="text-btn decline">拒絕</button>
		</div>
		<div class="timer-wrapper">
			<p class="timer" id="timer">{{ count }}</p>
		</div>
	</div>
</template>

<script>
/* eslint-disable */
import socket from "@/socket";
import sidebar from "@/store/modules/sidebarStatus";
import gameMode from "@/store/modules/gameMode";

export default {
	props: ["inviter"],
	data() {
		return {
			count: 30,
		};
	},
	mounted(){
		this.countDown();
	},
	watch: {
		count: function(value){
			if (value === 0) {
				this.decline();
			}
		},
	},
	methods: {
		challengeAccepted: function(){
			const payload = {
				inviterID: this.inviter.id
			};
			socket.emit("ACCEPT_BATTLE_INVITATION", payload);
			this.$store.dispatch(gameMode.actionTypes.UPDATE_GAME_MODE);
			this.$store.dispatch(sidebar.actionTypes.BATTLING);
		},
		decline: function(){
			this.$store.dispatch(sidebar.actionTypes.RESET_IDLE);
		},
		countDown: function(){
			if (this.count > 0) {
				setTimeout(() => {
					this.count-=1;
					this.countDown();
				}, 1000);
			}
		}
	}
}
</script>

<style lang="scss">
.invited{
	color: white;
	.username{
		font-size: 20px;
		margin: 10px auto;
		color: gold;
		text-shadow: 
			1px 1px 3px #ff0000, 
			1px 0 5px #0000FF;
	}
	.text-btn{
		border: none;
		background-color: inherit;
		padding: 8px 10px;
		font-size: 18px;
		font-weight: bold;
		cursor: pointer;
		display: inline-block;
		outline: 0;
		&.accept{
			color: #31B404;
		}
		&.decline{
			color: white;
		}
	}
	.btn-gruop{
		display: flex;
		justify-content: space-around;
		margin-top: 20px;
	}
	.timer-wrapper{
		.timer{
			color: white;
			font-size: 60px;
			line-height: 90px;
		}
	}
}
</style>