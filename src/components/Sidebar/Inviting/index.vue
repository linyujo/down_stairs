<template>
	<div class="invite">
		<div v-if="step === 1">
			召喚
			<div class="username">{{ inviteData.invitee.username }}</div>
			來一場激烈的決鬥嗎？
			<div class="btn-gruop">
				<button @click="sendInvitation" class="text-btn accept">
					YES
				</button>
				<button @click="decline" class="text-btn decline">NO</button>
			</div>
		</div>
		<div v-else>
			<div class="timer-wrapper">
				<p class="timer" id="timer">{{ count }}</p>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import socket from "@/socket";
import sidebarStatus from "@/store/modules/sidebarStatus";
import user from "@/store/modules/user";

export default {
	computed: {
		...mapGetters(["inviteData"])
	},
	data() {
		return {
			step: 1,
			count: 30,
			startingTime: 0,
			lastCall: null
		};
	},
	watch: {
		step: function(value) {
			if (value === 2) {
				this.startingTime = new Date();
				this.countDown();
				// this.onListenReply();
			}
		},
		count: function(value) {
			if (value === 0) {
				this.decline();
			}
		}
	},
	beforeDestroy: function() {
		socket.off("ACCEPT_BATTLE_INVITATION");
	},
	methods: {
		sendInvitation: function() {
			this.step = 2;
			const payload = {
				to: this.inviteData.invitee.id
			};
			socket.emit("BATTLE_INVITATION", payload);
		},
		onListenReply: function() {
			socket.on("ACCEPT_BATTLE_INVITATION", () => {
				this.$store.dispatch(user.actionTypes.UPDATE_STATUS);
			});
		},
		decline: function() {
			this.$store.dispatch(sidebarStatus.actionTypes.RESET_IDLE);
		},
		countDown: function() {
			// if (this.count > 0) {
			// 	setTimeout(() => {
			// 		this.count -= 1;
			// 		this.countDown();
			// 	}, 1000);
			// }
			const currentTime = new Date();
			if (currentTime - this.startingTime > 30 * 1000) {
				this.count = 0;
				clearTimeout(this.lastCall);
				return;
			}
			if (currentTime - this.startingTime < 30 * 1000) {
				if (this.lastCall) clearTimeout(this.lastCall);

				this.lastCall = setTimeout(() => {
					const secondsPassed = Math.floor(
						(currentTime - this.startingTime) / 1000
					);
					this.count = 29 - secondsPassed;
					this.countDown();
				}, 1000);
			}
		}
	}
};
</script>

<style lang="scss">
.invite {
	color: white;
	.username {
		font-size: 20px;
		margin: 10px auto;
		color: gold;
		text-shadow: 1px 1px 3px #ff0000, 1px 0 5px #0000ff;
	}
	.text-btn {
		border: none;
		background-color: inherit;
		padding: 8px 10px;
		font-size: 18px;
		font-weight: bold;
		cursor: pointer;
		display: inline-block;
		outline: 0;
		&.accept {
			color: #31b404;
		}
		&.decline {
			color: white;
		}
	}
	.btn-gruop {
		display: flex;
		justify-content: space-around;
		margin-top: 20px;
	}
	.timer-wrapper {
		.timer {
			color: white;
			font-size: 60px;
			line-height: 90px;
		}
	}
}
</style>
