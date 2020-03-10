<template>
	<div id="login-view">
		<div class="bg">
			<div class="bg__wave5">
				<div class="inner"></div>
			</div>
			<div class="bg__wave4">
				<div class="inner"></div>
			</div>
			<div class="bg__wave3">
				<div class="inner"></div>
			</div>
			<div class="bg__wave2">
				<div class="inner"></div>
			</div>
			<div class="bg__wave1">
				<div class="inner"></div>
			</div>
		</div>
		<div class="login-view_center">
			<form class="login-form" @submit.prevent="login">
				<h1 class="title">小朋友下樓梯</h1>
				<input
					class="login-input"
					required
					v-model="username"
					type="text"
					placeholder="請輸入暱稱"
				/>
				<button class="login-btn" type="submit">ENTER</button>
			</form>
		</div>
	</div>
</template>

<script>
import { mapGetters } from "vuex";

import User from "@/store/modules/user";
import socket from "@/socket";

export default {
	data() {
		return {
			username: ""
		};
	},
	computed: {
		...mapGetters(["authStatus"])
	},
	watch: {
		authStatus: {
			handler: function(updatedStatus) {
				if (updatedStatus === "login") {
					this.$router.push("/");
				}
			}
		}
	},
	methods: {
		login: function() {
			const { username } = this;
			const payload = {
				username: username
			};

			socket.emit("REQUEST_USER_TOKEN", payload);
			socket.on("RESPONSE_USER_TOKEN", token => {
				this.$store.dispatch(User.actionTypes.AUTH_SUCCESS, token);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
#login-view {
	height: 100%;
}

@keyframes wave {
	0% {
		transform: rotateZ(0deg);
	}
	50% {
		transform: translateY(-2%) rotateZ(180deg);
	}
	100% {
		transform: rotateZ(360deg);
	}
}

.bg {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 1);
	.bg__wave1 {
		width: 40%;
		height: 40vw;
		position: absolute;
		top: 50%;
		left: 40%;
		transform: translate(-50%, -50%);
		.inner {
			width: 100%;
			height: 100%;
			background-color: rgb(0, 0, 0);
			border-radius: 45%;
			animation: wave 10s infinite linear;
			box-shadow: 25px 6px 141px 140px rgba(28, 31, 36, 1);
		}
	}
	.bg__wave2 {
		width: 46%;
		height: 46vw;
		position: absolute;
		top: 50%;
		left: 40%;
		transform: translate(-50%, -50%);
		.inner {
			width: 100%;
			height: 100%;
			background-color: rgb(0, 0, 0);
			opacity: 0.5;
			border-radius: 47%;
			animation: wave 10s infinite linear;
		}
	}
	.bg__wave3 {
		width: 60%;
		height: 60vw;
		position: absolute;
		top: 50%;
		left: 40%;
		transform: translate(-50%, -50%);
		.inner {
			width: 100%;
			height: 100%;
			border-radius: 45%;
			background-color: rgb(46, 46, 46);
			opacity: 0.5;
			animation: wave 10s infinite linear;
			box-shadow: 36px 6px 107px -9px rgb(58, 58, 58);
		}
	}
	.bg__wave4 {
		width: 80%;
		height: 80vw;
		position: absolute;
		top: 50%;
		left: 40%;
		transform: translate(-50%, -50%);
		.inner {
			width: 100%;
			height: 100%;
			border-radius: 47%;
			background-color: rgb(59, 59, 59);
			opacity: 0.7;
			animation: wave 10s infinite linear;
			animation-delay: 2s;
		}
	}
	.bg__wave5 {
		width: 90%;
		height: 90vw;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		.inner {
			width: 100%;
			height: 100%;
			border-radius: 45%;
			background-color: rgb(70, 69, 69);
			opacity: 0.6;
			box-shadow: 36px 6px 107px -9px rgb(58, 58, 58);
		}
	}
}

.login-view_center {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	canvas {
		border-radius: 20%;
	}
}

.title {
	font-size: 48px;
	color: rgba(255, 255, 255, 0.3);
	text-shadow: 0 0 15px rgba(255, 255, 255, 0.5),
		0 0 10px rgba(255, 255, 255, 0.5);
}

input {
	display: block;
	margin: 0;
	padding: 10px;
	box-shadow: none;
	border: none;
	border-radius: 0;
	background: none;
	outline: 0;
	letter-spacing: normal;
	word-spacing: normal;
	cursor: text;
}
.login-input {
	width: 300px;
	margin: 12px auto 0 auto;
	background: #fff;
}
button {
	background: none;
	cursor: pointer;
}
.login-btn {
	width: 300px;
	height: 40px;
	margin: 12px 0 0 0;
	padding: 6px 24px;
	font-size: 1rem;
	text-align: center;
	border: 1px solid #54381e;
	border-radius: 4px;
	color: rgba(255, 255, 255, 0.5);
	font-family: "Press Start 2P";
	text-decoration: none;
	text-shadow: 0 0 15px rgba(255, 255, 255, 0.5),
		0 0 10px rgba(255, 255, 255, 0.5);
	box-shadow: inset 0px 1px 0px 0px #a6827e;
	background: linear-gradient(to bottom, #7d5d3b 5%, #634b30 100%);
	background-color: #7d5d3b;
	&:hover {
		background: linear-gradient(to bottom, #634b30 5%, #7d5d3b 100%);
		background-color: #634b30;
	}
	&:active {
		position: relative;
		top: 1px;
	}
}
</style>
