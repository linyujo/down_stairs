<template>
	<div class="game">
		<canvas ref="playground" class="playground"></canvas>
	</div>
</template>

<script>
/* eslint-disable */
import socket from "@/socket";
import Vec2D from "@/utils/Vector2D";
import Game from "./GameDual";
import { mapGetters } from "vuex";

const canvasWidth = 800;
const canvasHeight = 600;

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
	initConfigs = { // socket傳來的初始設定
		roomID: 0,
		initStairConfigs: [],
		initPlayerConfigs: []
	};
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
		// ctxExpansion(this.ctx);
		this.width = this.node.width = canvasWidth;
		this.height = this.node.height = canvasHeight;

		// 遊戲
		this.game = new Game({
			ctx: this.ctx,
			width: this.width,
			height: this.height,
			...this.initConfigs
		});

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
	computed: {
		...mapGetters(["clientID"])
	},
	mounted: function() {
		// 遊戲本體
		this.canvas = new Canvas(this.$refs.playground);

		window.addEventListener("keydown", evt => {
			this.canvas.handleKeyDown(evt);
		});
		window.addEventListener("keyup", evt => {
			this.canvas.handleKeyUp(evt);
		});

		socket.on("GAME_INIT_DATA", payload => {
			payload.controlledPlayerID = payload.initPlayerConfigs.find(char => char.master === this.clientID).playerID;
			// console.log('payload', payload);
			this.canvas.initConfigs = payload;

			this.canvas.init();
		});

		socket.on("GAME_START", () => {
			this.canvas.start();
		});

		socket.on("NEW_STAIR_CONFIG", payload => {
			this.canvas.game.addNewStair(payload.newStairConfig);
		});

		socket.on("UPDATE_RIVAL", payload => {
			this.canvas.game.players.forEach(player => {
				let updatedPlayer = player;
				if (player.playerID === payload.playerID){
					updatedPlayer.position = payload.position;
					updatedPlayer.direction = payload.direction;
					updatedPlayer.isRunning = payload.isRunning;
				}
				return updatedPlayer
			});
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
</style>
