<template>
	<div
		:class="[
			'online-user-wrapper',
			sidebarStatus === 'invited' ? 'highLighted' : ''
		]"
		ref="onlineUserWrapper"
		v-on:mousemove="handleMouseMove"
		v-on:mouseout="handleMouseOut"
	>
		<h3>{{ sidebarTitle }}</h3>
		<ul v-if="sidebarStatus === 'idle'">
			<List
				v-for="user in userList"
				v-bind:key="user.id"
				:user="user"
				:handleClick="handleInvite"
			/>
		</ul>
		<div v-else-if="sidebarStatus === 'inviting'">
			<Inviting :invitee="invitee" />
		</div>
		<div v-else-if="sidebarStatus === 'invited'">
			<Invited :inviter="inviter" />
		</div>
		<div v-else>
			<div></div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from "vuex";

import UserCard from "@/components/UserCard";
import Inviting from "@/components/Sidebar/Inviting";
import Invited from "@/components/Sidebar/Invited";

import sidebar from "@/store/modules/sidebarStatus";
import socket from "@/socket";

export default {
	components: {
		List: UserCard,
		Inviting: Inviting,
		Invited: Invited
	},
	computed: {
		...mapGetters([
			"userList",
			"sidebarStatus",
			"sidebarTitle",
			"clientID",
			"isBattling"
		])
	},
	watch: {
		isBattling: {
			handler: function(bool) {
				if (bool) {
					this.$store.dispatch(sidebar.actionTypes.BATTLING);
				}
			}
		}
	},
	data() {
		return {
			invitee: null,
			intiter: null
		};
	},
	mounted() {
		socket.on("RECEIVED_BATTLE_INVITATION", payload => {
			this.inviter = payload.inviter;
			this.$store.dispatch(sidebar.actionTypes.INVITED);
			this.$refs.onlineUserWrapper.style.boxShadow =
				"box-shadow: 4px 10px 50px 10px rgba(255,255,255,1);";
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
		},
		handleInvite: function(user) {
			if (user.id === this.clientID) return;
			this.invitee = user;
			this.$store.dispatch(sidebar.actionTypes.INVITING);
		}
	}
};
</script>

<style lang="scss">
.online-user-wrapper {
	width: 250px;
	margin: 16px 16px 16px 0;
	padding: 10px 16px;
	// background: #fefefe;
	border-radius: 10px;
	border-top-left-radius: 30px;
	box-shadow: 25px 6px 103px -27px rgba(0, 0, 0, 0.75);
	overflow: hidden;
	transition: all 0.2s;
	&.highLighted {
		box-shadow: -1px 1px 50px 10px rgba(255, 255, 255, 1);
	}
	ul {
		padding-left: 0;
	}
	h3 {
		color: white;
		z-index: 1;
		margin-bottom: 40px;
	}
	.notify {
		color: white;
	}
}
</style>
