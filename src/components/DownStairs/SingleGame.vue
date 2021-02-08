<template>
	<div class="game">
		<canvas ref="playground" class="playground"></canvas>
		<button
			v-on:click="toggleGame"
			:class="['gameBtn startBtn', isHidden ? 'hidden' : '']"
			ref="startButton"
			id="startButton"
		>
			Start
		</button>
		<button
			v-on:click="exitGame"
			:class="['gameBtn exitBtn', isHidden ? 'hidden' : '']"
			ref="exitButton"
			id="exitButton"
		>
			Exit
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
	</div>
</template>

<script>
import Vec2D from "@/utils/Vector2D";
import { debounce } from "@/utils/utilFuncs";

import Game from "./Game";

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

		requestAnimationFrame(this.render);
		setInterval(this.update, 1000 / this.updateFPS);
	};
	start = () => {
		this.game.willInit();
		window.addEventListener("keydown", debounce(this.handleKeyDown, 100));
		window.addEventListener("keyup", debounce(this.handleKeyUp, 100));
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
	willDestroy = () => {
		window.removeEventListener("keydown", this.handleKeyDown);
		window.removeEventListener("keyup", this.handleKeyUp);
		clearInterval(this.update);
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
			},
			exitGame: () => {
				this.$router.push("/");
			}
		};
	},
	mounted() {
		// 遊戲本體
		this.canvas = new Canvas(this.$refs.playground);
		this.canvas.init();
	},
	willDestroy: function() {
		this.canvas.willDestroy();
	}
};
</script>

<style lang="scss" scoped>
.game {
	height: 100%;
}
.playground {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
.gameBtn {
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
.startBtn {
	position: absolute;
	top: 42%;
	left: 50%;
	transform: translate(-50%, -42%);
}
.exitBtn {
	position: absolute;
	top: 60%;
	left: 50%;
	transform: translate(-50%, -60%);
	padding-left: 95px;
	padding-right: 95px;
}
</style>
