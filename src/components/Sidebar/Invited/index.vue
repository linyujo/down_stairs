<template>
	<div class="invited">
		<div class="username">{{ inviteData.inviter.username }}</div>
		想與你<br />
		來一場激烈的決鬥
		<div class="btn-gruop">
			<button @click.once="challengeAccepted" class="text-btn accept">
				接受
			</button>
			<button @click.once="decline" class="text-btn decline">拒絕</button>
		</div>
		<div class="timer-wrapper">
			<p class="timer" id="timer">{{ count }}</p>
		</div>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import socket from "@/socket";
import sidebar from "@/store/modules/sidebarStatus";

export default {
	computed: {
		...mapGetters(["inviteData"])
	},
	data() {
		return {
			count: 29,
			startingTime: 0,
			lastCall: null
		};
	},
	mounted() {
		this.startingTime = new Date();
		this.countDown();
	},
	watch: {
		count: function(value) {
			if (value === 0) {
				this.decline();
			}
		}
	},
	methods: {
		challengeAccepted: function() {
			const payload = {
				to: this.inviteData.inviter.id,
				roomID: this.inviteData.roomID
			};
			socket.emit("ACCEPT_BATTLE_INVITATION", payload);
		},
		decline: function() {
			this.$store.dispatch(sidebar.actionTypes.RESET_IDLE);
		},
		countDown: function() {
			// if (this.count > 0) {
			// 	setTimeout(() => {
			// 		this.count -= 1;
			// 		this.countDown();
			// 	}, 1000);
			// }
			const currentTime = new Date();
			if (currentTime - this.startingTime > 29 * 1000) {
				this.count = 0;
				clearTimeout(this.lastCall);
				return;
			}
			if (currentTime - this.startingTime < 29 * 1000) {
				clearTimeout(this.lastCall);
				this.lastCall = setTimeout(() => {
					const secondsPassed = Math.floor(
						currentTime - this.startingTime / 1000
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
.invited {
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
