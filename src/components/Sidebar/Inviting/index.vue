<template>
	<div class="invite">
		<div v-if="step === 1">
			召喚
			<div class="username">{{ invitee.username }}</div>
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
import socket from "@/socket";
import sidebarStatus from "@/store/modules/sidebarStatus";
import user from "@/store/modules/user";

export default {
	props: ["invitee", "setTitle"],
	data() {
		return {
			step: 1,
			count: 30
		};
	},
	watch: {
		step: function(value) {
			if (value === 2) {
				this.countDown();
				this.onListenReply();
			}
		},
		count: function(value) {
			if (value === 0) {
				this.decline();
			}
		}
	},
	methods: {
		sendInvitation: function() {
			this.step = 2;
			const payload = {
				inviteeID: this.invitee.id
			};
			socket.emit("SEND_BATTLE_INVITATION", payload);
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
			if (this.count > 0) {
				setTimeout(() => {
					this.count -= 1;
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
