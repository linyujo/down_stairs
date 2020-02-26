<template>
	<div id="login-view">
		<!-- 跑步向右 -->
		<img id="runRightImg" src="@/assets/loginRunning.png" style="display:none" />
		<canvas ref="running" id="runningCharactor" style="display:none;"></canvas>
		<!-- 跑步向左 -->
		<img id="runLeftImg" src="@/assets/loginRunningLeft.png" style="display:none" />
		<canvas ref="runningLeft" id="runningLeftCharactor" style="display:none;"></canvas>

		<div class="login-view_center">
			<canvas ref="loginAnime"></canvas>
			<form class="login-form" @submit.prevent="login">
				<div class="title">
					<div class="imageBox">
						<div class="imageBox__ratio">
							<div class="image" :style="{background: titleImageUrl}" />
						</div>
					</div>
				</div>
				<input class="login-input" required v-model="username" type="text" placeholder="請輸入暱稱" />
				<button class="login-btn" type="submit">進入</button>
			</form>
		</div>
	</div>
</template>

<script>
/* eslint-disable */
import { mapState } from "vuex";

import Vec2D from "@/utils/Vector2D";
import user from "@/store/modules/user";
import Animation from "@/components/LoginAnimation/Animation";
import PlayerAction from "@/components/DownStairs/PlayerAction";

const userActionTypes = user.actionTypes;

function ctxExpansion(ctx) {
	ctx.drawCircle = function(v, r) {
		this.arc(v.x, v.y, r, 0, Math.PI * 2);
	};
	ctx.drawLine = function(v1, v2) {
		this.moveTo(v1.x, v1.y);
		this.lineTo(v2.x, v2.y);
	};
}

class Canvas {
	node;
	width = 0;
	height = 0;
	ctx;
	animation;
	mouse = {
		position: new Vec2D(0, 0),
		posDown: new Vec2D(0, 0),
		posUp: new Vec2D(0, 0)
	};
	constructor(node) {
		this.node = node;
	}
	init = () => {
		if (!this.node) {
			throw new Error("canvas is not created");
		}
		this.ctx = this.node.getContext("2d");
		this.width = this.node.width = 560;
		this.height = this.node.height = 440;
		ctxExpansion(this.ctx);

		this.node.addEventListener("mousemove", this.handleMouseMove);

		// 動畫
		this.animation = new Animation({
			ctx: this.ctx,
			width: this.width,
			height: this.height
		});
		this.animation.init();

		requestAnimationFrame(this.render);
		setInterval(this.update, 1000 / 30);
	};
	update = () => {
		// 遊戲
		this.animation.update();
	};
	render = () => {
		// 清空
		this.ctx.clearRect(0, 0, this.width, this.height);

		// 遊戲
		this.animation.render();
		// 滑鼠游標
		// this.cursor();

		requestAnimationFrame(this.render);
	};
	cursor = () => {
		const { position } = this.mouse;
		this.ctx.fillStyle = "red";
		this.ctx.beginPath();
		this.ctx.drawCircle(position, 3);
		this.ctx.fill();

		this.ctx.save();
		this.ctx.beginPath();

		this.ctx.translate(position.x, position.y);
		this.ctx.strokeStyle = "red";

		this.ctx.fillText(position, 10, -10); // 靶心座標文字
		const bullLength = 20; // 靶心長度
		// 靶心X軸
		this.ctx.drawLine(new Vec2D(-bullLength, 0), new Vec2D(bullLength, 0));
		// 旋轉90, 靶心Y軸
		this.ctx.rotate(Math.PI / 2);
		this.ctx.drawLine(new Vec2D(-bullLength, 0), new Vec2D(bullLength, 0));
		this.ctx.stroke();

		this.ctx.restore();
	};
	handleMouseMove = evt => {
		this.mouse.position.set(evt.offsetX, evt.offsetY);
	};
}

export default {
	data() {
		return {
			username: "",
			titleImageUrl: `url(${require("@/assets/down_stair_title.png")})`
		};
	},
	computed: mapState(["user"]),
	watch: {
		user: {
			handler: function(updatedUser, prevUser) {
				if (updatedUser.status === "login") {
					this.$router.push("/");
				}
			},
			deep: true
		}
	},
	methods: {
		login: function() {
			const { username } = this;
			const payload = {
				type: "username",
				username: username
			};

			this.$store.dispatch(userActionTypes.AUTH_REQUEST, payload);
		}
	},
	mounted() {
		// 動畫本體
		this.canvas = new Canvas(this.$refs.loginAnime);
		this.canvas.init();

		// 角色跑步
		const playerRunning = new PlayerAction({
			node: this.$refs.running,
			imgID: "runRightImg",
			frameCountDelay: 4
		});
		playerRunning.init();

		const playerRunningLeft = new PlayerAction({
			node: this.$refs.runningLeft,
			imgID: "runLeftImg",
			frameCountDelay: 4
		});
		playerRunningLeft.init();
	}
};
</script>

<style lang="scss" scoped>
#login-view {
	height: 100vh;
	// background: #7dc8d8;
}
.login-view_center {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.title {
	width: 346px;
	margin: 0 auto;
}
.imageBox {
	width: 100%;
	overflow: hidden;
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
.imageBox__ratio {
	width: 100%;
	padding-top: 20%;
}

.login-form {
	//top: 50vh;
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
	font-size: 1rem;
	text-align: center;
	border: none;
	border-radius: 4px;
	background: #fff076;
}
</style>