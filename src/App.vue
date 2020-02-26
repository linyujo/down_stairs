<template>
	<div id="app">
		<div class="app-wrapper">
			<!-- <div id="nav">
				<router-link to="/">單人</router-link>|
				<router-link to="/pk">雙人</router-link>
			</div>-->
			<div id="router-view">
				<router-view />
			</div>
			<ul class="online-user-wrapper">
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
	font-family: "Avenir", Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

.app-wrapper {
	display: flex;
	#router-view {
		flex: 1;
	}
}

.online-user-wrapper {
	border-left: 1px solid #d8d8d8;
	width: 250px;
	height: 100vh;
	margin: 0;
	padding: 10px 8px;
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
