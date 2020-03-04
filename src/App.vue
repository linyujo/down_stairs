<template>
	<div id="app">
		<div class="app-wrapper">
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
				<UserCard
					v-for="user in userList"
					v-bind:key="user.id"
					:user="user"
				/>
			</ul>
		</div>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import socket from "@/socket";
import UserCard from "@/components/UserCard";
import UserList from "@/store/modules/userList";

export default {
	components: {
		UserCard
	},
	computed: {
		...mapGetters(["userList"])
	},
	mounted() {
		socket.emit("REQUEST_CURRENT_USERS");
		socket.on("RESPONSE_CURRENT_USERS", userList => {
			this.$store.dispatch(UserList.actionTypes.CURRENT_USERS, userList);
		});
		socket.on("ADD_ONE_USER", user => {
			this.$store.dispatch(UserList.actionTypes.ADD_ONE_USER, user);
		});
		socket.on("DELETE_ONE_USER", id => {
			this.$store.dispatch(UserList.actionTypes.DELETE_ONE_USER, id);
		});
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
	display: flex;
	justify-content: space-between;
	#router-view {
		border-radius: 6px;
		height: 100%;
		flex: 1;
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
		margin-bottom: 40px;
	}
}
</style>
