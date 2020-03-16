<template>
	<div class="game">
		<canvas ref="playground" class="playground"></canvas>
		<button
			v-on:click="toggleGame"
			:class="['startBtn', isHidden ? 'hidden' : '']"
			ref="startButton"
			id="startButton"
		>
			Start
		</button>
		<!-- 音訊 -->
		<audio id="backgroundMusic" loop>
			<source src="@/assets/audio/bgMusic.mp3" type="audio/mp3" />
		</audio>
		<audio id="transmitSound">
			<source src="@/assets/audio/transmit.mp3" type="audio/mp3" />
		</audio>
		<audio id="stabSound">
			<source src="@/assets/audio/stab.mp3" type="audio/mp3" />
		</audio>
		<audio id="gameOverSound">
			<source src="@/assets/audio/gameOver.mp3" type="audio/mp3" />
		</audio>
		<audio id="bounceSound">
			<source src="@/assets/audio/bounce.mp3" type="audio/mp3" />
		</audio>
		<audio id="stepSound">
			<source src="@/assets/audio/step.mp3" type="audio/mp3" />
		</audio>
		<!-- 站立向右 -->
		<!-- <canvas
			ref="player1StandRight"
			id="player1StandRight"
			style="display:none"
		></canvas> -->
		<!-- 站立向左 -->
		<!-- <canvas
			ref="player1StandLeft"
			id="player1StandLeft"
			style="display:none"
		></canvas> -->
		<!-- 跳躍 向右 -->
		<!-- <img
			id="jumpRightPlayer1"
			src="@/assets/player1/jumpRight.png"
			style="display:none"
		/> -->
		<!-- 跳躍 向左 -->
		<!-- <img
			id="jumpLeftPlayer1"
			src="@/assets/player1/jumpLeft.png"
			style="display:none"
		/> -->
		<!-- 走路向右 -->
		<!-- <canvas
			ref="player1WalkRight"
			id="player1WalkRight"
			style="display:none"
		></canvas> -->
		<!-- 走路向左 -->
		<!-- <canvas
			ref="player1WalkLeft"
			id="player1WalkLeft"
			style="display:none"
		></canvas> -->
		<!-- 受傷向右 -->
		<!-- <canvas
			ref="player1HurtedRight"
			id="player1HurtedRight"
			style="display:none"
		></canvas> -->
		<!-- 受傷向左 -->
		<!-- <canvas
			ref="player1HurtedLeft"
			id="player1HurtedLeft"
			style="display:none"
		></canvas> -->
	</div>
</template>

<script>
/* eslint-disable */
import Vec2D from "@/utils/Vector2D";

import Game from "./Game";
import PlayerAction from "./PlayerAction";

const canvasWidth = 800;
const canvasHeight = 600;

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
	width;
	height;
	ctx;
	updateFPS = 30;

	mouse = {
		position: new Vec2D(0, 0),
		posDown: new Vec2D(0, 0),
		posUp: new Vec2D(0, 0)
	};
	game = null;
	constructor(node) {
		this.node = node;
	}
	set width(w) {
		this.width = w;
	}

	set height(h) {
		this.height = h;
	}
	init = () => {
		if (!this.node) {
			throw new Error("canvas is not created");
		}
		this.ctx = this.node.getContext("2d");
		ctxExpansion(this.ctx);
		this.width = this.node.width = canvasWidth;
		this.height = this.node.height = canvasHeight;

		// 遊戲
		this.game = new Game({
			ctx: this.ctx,
			width: this.width,
			height: this.height
		});
		// this.game.init();

		this.node.addEventListener("mousemove", this.handleMouseMove);
		requestAnimationFrame(this.render);
		setInterval(this.update, 1000 / this.updateFPS);
	};
	start = () => {
		this.game.willInit();
	};
	update = () => {
		// 遊戲
		this.game.update();
	};
	render = () => {
		// 清空背景
		this.ctx.fillStyle = "black";
		this.ctx.fillRect(0, 0, this.width, this.height);

		// 遊戲
		this.game.render();

		requestAnimationFrame(this.render);
		// 滑鼠游標
		// this.cursor();
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
	handleMouseDown = evt => {
		const { position } = this.mouse;
		position.set(evt.offsetX, evt.offsetY);
		this.mouse.posDown = position.clone();
	};
	handleMouseUp = evt => {
		const { position } = this.mouse;
		position.set(evt.offsetX, evt.offsetY);
		this.mouse.posDown = position.clone();
	};
	handleKeyDown = evt => {
		if (!this.game) {
			return;
		}
		if (evt.key === "ArrowLeft") {
			this.game.keyStatus.left = true;
		}
		if (evt.key === "ArrowRight") {
			this.game.keyStatus.right = true;
		}
	};
	handleKeyUp = evt => {
		if (!this.game) {
			return;
		}
		if (evt.key === "ArrowLeft") {
			this.game.keyStatus.left = false;
		}
		if (evt.key === "ArrowRight") {
			this.game.keyStatus.right = false;
		}
	};
}

export default {
	data() {
		return {
			isHidden: false,
			toggleGame: () => {
				if (!this.canvas) {
					return;
				}
				if (this.isHidden) {
					this.isHidden = false;
				} else {
					this.canvas.start();
					this.isHidden = true;
				}
			}
		};
	},
	mounted() {
		// PlayerOne 站立 向右
		// const playerOneStandRight = new PlayerAction({
		// 	node: this.$refs.player1StandRight,
		// 	imgSrc: require("@/assets/player1/standRight.png")
		// });
		// playerOneStandRight.init();

		// PlayerOne 站立 向左
		// const playerOneStandLeft = new PlayerAction({
		// 	node: this.$refs.player1StandLeft,
		// 	imgSrc: require("@/assets/player1/standLeft.png")
		// });
		// playerOneStandLeft.init();

		// PlayerOne 走路 向右
		// const playerOneWalkRight = new PlayerAction({
		// 	node: this.$refs.player1WalkRight,
		// 	imgSrc: require("@/assets/player1/walkRight.png"),
		// 	frameCountDelay: 4
		// });
		// playerOneWalkRight.init();

		// PlayerOne 走路 向左
		// const playerOneWalkLeft = new PlayerAction({
		// 	node: this.$refs.player1WalkLeft,
		// 	imgSrc: require("@/assets/player1/walkLeft.png"),
		// 	frameCountDelay: 4
		// });
		// playerOneWalkLeft.init();

		// PlayerOne 受傷 向右
		// const playerOneHurtedRight = new PlayerAction({
		// 	node: this.$refs.player1HurtedRight,
		// 	imgSrc: require("@/assets/player1/hurtedRight.png"),
		// 	frameCountDelay: 4,
		// 	isInfinite: false
		// });
		// playerOneHurtedRight.init();

		// PlayerOne 受傷 向左
		// const playerOneHurtedLeft = new PlayerAction({
		// 	node: this.$refs.player1HurtedLeft,
		// 	imgSrc: require("@/assets/player1/hurtedLeft.png"),
		// 	frameCountDelay: 4,
		// 	isInfinite: false
		// });
		// playerOneHurtedLeft.init();

		// 遊戲本體
		this.canvas = new Canvas(this.$refs.playground);
		this.canvas.init();

		// 事件
		// window.addEventListener("resize", () => {
		// 	this.canvas.init();
		// });
		window.addEventListener("keydown", evt => {
			this.canvas.handleKeyDown(evt);
		});
		window.addEventListener("keyup", evt => {
			this.canvas.handleKeyUp(evt);
		});
	}
};
</script>

<style lang="scss" scoped>
.game{
	height: 100%;
}
.playground {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
.startBtn {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	padding: 10px 70px;
	background: rgba(white, 0.2);
	color: white;
	font-family: "Press Start 2P";
	font-size: 50px;
	border-radius: 500px;
	border: none;
	cursor: pointer;
	outline: none;
	transition: 0.2s all;
	&:hover {
		background: rgba(white, 0.3);
	}
	&.hidden {
		display: none;
	}
}
</style>
