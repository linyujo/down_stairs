<template>
	<div id="app">
		<div class="app-wrapper">
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
			<div id="router-view">
				<router-view />
			</div>
			<ul
				class="online-user-wrapper"
				ref="onlineUserWrapper"
				v-on:mousemove="handleMouseMove"
				v-on:mouseout="handleMouseOut"
			>
				<h3>在線成員</h3>
				<UserCard v-for="user in userList" v-bind:key="user.id" :user="user" />
			</ul>
		</div>
	</div>
</template>

<script>
/* eslint-disable */
import { mapState } from "vuex";

import webSocket from "@/store/modules/webSocket";
import UserCard from "@/components/UserCard";

export default {
	components: {
		UserCard
	},
	computed: mapState(["userList"]),
	created() {
		this.$store.dispatch(webSocket.actionTypes.INIT_WEBSOCKET);
	},
	methods: {
		handleMouseOut: function() {
			const onlineUserWrapper = this.$refs.onlineUserWrapper;
			onlineUserWrapper.style.background = "none";
		},
		handleMouseMove: function(evt) {
			const onlineUserWrapper = this.$refs.onlineUserWrapper;
			// const childBounds = evt.target.getBoundingClientRect();
			// const parentBounds = evt.target.parentElement.getBoundingClientRect();
			const moveX = evt.clientX - evt.target.offsetLeft;
			const moveY = evt.clientY - evt.target.offsetTop;
			onlineUserWrapper.style.background = `
			radial-gradient(circle closest-corner at
			${moveX}px
			${moveY}px,
			rgba(255,253,221,100) 0%, rgba(0,0,0,.1) 66%)`;
		}
	}
};
</script>

<style lang="scss">
* {
	position: relative;
	box-sizing: border-box;
}
*::before,
*::after {
	margin: 0;
	padding: 0;
}

#app {
	font-family: "STHeiti", "PingFang", "LiHei Pro", "Microsoft JhengHei",
		"Avenir", Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

.app-wrapper {
	height: 100vh;
	// padding: 20px;
	display: flex;
	justify-content: space-between;
	#router-view {
		// background: white;
		border-radius: 6px;
		height: 100%;
		flex: 1;
	}
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
	background: rgba(39, 39, 39, 0.8);
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

.online-user-wrapper {
	width: 250px;
	margin-right: 16px;
	padding: 10px 16px;
	// background: #fefefe;
	border-radius: 10px;
	border-top-left-radius: 30px;
	box-shadow: 25px 6px 103px -27px rgba(0, 0, 0, 0.75);
	overflow: hidden;
	h3 {
		color: white;
		z-index: 1;
		margin-bottom: 80px;
	}
}

#nav {
	padding: 10px;
	a {
		font-weight: bold;
		color: #2c3e50;

		&.router-link-exact-active {
			color: #42b983;
		}
	}
}
</style>
