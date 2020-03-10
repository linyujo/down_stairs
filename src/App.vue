<template>
	<div id="app">
		<div class="app-wrapper">
			<div id="router-view">
				<router-view />
			</div>
			<Sidebar />
		</div>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import socket from "@/socket";
import Sidebar from "@/components/Sidebar";
import UserList from "@/store/modules/userList";

export default {
	components: {
		Sidebar: Sidebar
	},
	computed: {
		...mapGetters(["isBattling"])
	},
	watch: {
		isBattling: {
			handler: function(bool) {
				if (bool) {
					this.$router.push("/dual");
				}
			}
		}
	},
	mounted() {
		socket.emit("REQUEST_CURRENT_USERS");
		socket.on("RESPONSE_CURRENT_USERS", payload => {
			this.$store.dispatch(
				UserList.actionTypes.CURRENT_USERS,
				payload.userList
			);
		});
		socket.on("ADD_ONE_USER", payload => {
			this.$store.dispatch(
				UserList.actionTypes.ADD_ONE_USER,
				payload.user
			);
		});
		socket.on("DELETE_ONE_USER", payload => {
			this.$store.dispatch(
				UserList.actionTypes.DELETE_ONE_USER,
				payload.id
			);
		});
		socket.on("UPDATE_ONE_USER", payload => {
			this.$store.dispatch(
				UserList.actionTypes.UPDATE_ONE_USER,
				payload.user
			);
		});
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
</style>
