<template>
	<li
		:class="['user-card', isHovered ? 'hover' : '']"
		@click="handleClick(user)"
	>
		<div class="avatar">
			<div class="imageBox">
				<div class="imageBox__ratio">
					<div
						class="image"
						:style="{ background: `url(${user.avatar}) ` }"
					/>
				</div>
			</div>
			<div class="avatar-mask"></div>
		</div>
		<div class="user">
			<div class="userName">{{ user.username }}</div>
			<div :class="['userStatus', user.status]">
				{{ user.status === "idle" ? "閒置中" : "決鬥中" }}
			</div>
		</div>
	</li>
</template>

<script>
export default {
	props: ["user", "handleClick"],
	data() {
		return {
			isHovered: false
		};
	},
	methods: {
		handleMouseOver: function() {
			this.isHovered = true;
		},
		handleMouseOut: function() {
			this.isHovered = false;
		}
	}
};
</script>

<style lang="scss" scoped>
$background-types: (
	1: #ab3df6,
	2: #f92673,
	3: #d02d45,
	4: #48d555,
	5: #5bc7f9,
	6: #2671cd
);

@mixin background {
	@for $i from 1 through 7 {
		&:nth-child(#{$i}) {
			background: linear-gradient(
				90deg,
				map-get($background-types, $i) 0%,
				#ffffff 18%,
				#ffffff 100%
			);
		}
	}
}

li {
	display: inline-block;
	list-style: none;
}

.user-card {
	display: flex;
	align-items: center;
	padding: 10px 8px;
	margin-bottom: 8px;
	border-radius: 6px;
	cursor: pointer;
	transition: 0.3s;
	&:hover {
		background: radial-gradient(
			circle,
			rgba(255, 255, 255, 1) 0%,
			rgba(255, 253, 231, 1) 66%
		);
		box-shadow: 10px 10px 234px 64px rgba(255, 255, 255, 1);
		.avatar-mask {
			background: rgba(0, 0, 0, 0);
		}
	}
}
.avatar {
	width: 50px;
	overflow: hidden;
	border-radius: 6px;
	.avatar-mask {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.7);
	}
}
.imageBox {
	width: 100%;
	.image {
		/* 定位 */
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		/* 圖片 */
		background-size: cover;
		background-position: center;
	}
}
.imageBox .imageBox__ratio {
	width: 100%;
	padding-top: 100%;
	position: relative;
}
.user {
	flex: 1;
	margin-left: 16px;
	overflow: hidden;
	text-align: left;
	.userName {
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 1.2em;
	}
	.userStatus {
		&.idle {
			color: rgb(44, 171, 255);
			font-size: 14px;
			margin-top: 10px;
		}
		&.battling {
			color: rgb(255, 70, 45);
			font-weight: bold;
		}
	}
}
</style>
