<template>
	<div class="game">
		<canvas ref="playground" class="playground"></canvas>
		<div
			:class="['endingText win', isWin ? 'show' : '']"
			id="winText"
			v-on:click="showWinText"
		>
			<span>YOU</span>
			<span> WIN</span>
		</div>
		<div
			:class="['endingText loose', isLoose ? 'show' : '']"
			id="looseText"
			v-on:click="showLooseText"
		>
			<span>YOU</span>
			<span> LOOSE</span>
		</div>
		<!-- <div :class="['text_loose', isHidden ? 'hidden' : '']">YOU LOOSE</div> -->
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
		<audio id="gameWinSound">
			<source src="@/assets/audio/gameWin.mp3" type="audio/mp3" />
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
import socket from "@/socket";
import Vec2D from "@/utils/Vector2D";
import Game from "./GameDual";
import { PlayerOne, PlayerTwo } from "./MotionCanvas";
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
	initConfigs = {
		// socket傳來的初始設定
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
		this.width = this.node.width = canvasWidth;
		this.height = this.node.height = canvasHeight;

		this.gameInfo();
	};
	start = () => {
		window.addEventListener("keydown", this.handleKeyDown);
		window.addEventListener("keyup", this.handleKeyUp);

		// 遊戲
		this.game = new Game({
			ctx: this.ctx,
			width: this.width,
			height: this.height,
			...this.initConfigs
		});

		requestAnimationFrame(this.render);
		setInterval(this.update, 1000 / this.updateFPS);
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
	};
	unmount = () => {
		window.removeEventListener("keydown", this.handleKeyDown);
		window.removeEventListener("keyup", this.handleKeyUp);
	};
	gameInfo = () => {
		const { ctx, width, height } = this;

		const playerMotion =
			this.initConfigs.controlledPlayerID === 1 ? PlayerOne : PlayerTwo;
		const headPositionX = width / 2 - playerMotion.head.width / 2; // 中間 - 頭像寬
		const headPositionY = height * 0.5;

		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, this.width, this.height);

		ctx.font = "40px STHeiti, Microsoft JhengHei";
		ctx.fillStyle = "white";
		ctx.fillText("YOU ARE", 320, height * 0.33333);

		ctx.drawImage(
			playerMotion.head,
			0,
			0,
			playerMotion.head.width,
			playerMotion.head.height,
			headPositionX,
			headPositionY,
			playerMotion.head.width,
			playerMotion.head.height
		);
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
	props: ["resetAllStatusToIdle", "roomID"],
	computed: {
		...mapGetters(["clientID"])
	},
	data: function() {
		return {
			isWin: false,
			isLoose: false,
			canvas: null
		};
	},
	mounted: function() {
		// 遊戲本體
		this.canvas = new Canvas(this.$refs.playground);

		socket.on("GAME_INIT_DATA", payload => {
			let controlledPlayerID;
			let rivalPlayerID;
			payload.initPlayerConfigs.forEach(charactor => {
				if (charactor.master === this.clientID) {
					controlledPlayerID = charactor.playerID;
				} else {
					rivalPlayerID = charactor.playerID;
				}
			});
			payload.controlledPlayerID = controlledPlayerID;
			payload.rivalPlayerID = rivalPlayerID;
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
			this.canvas.game.updateRival(payload);
		});
	},
	beforeDestroy: function() {
		socket.off("GAME_INIT_DATA");
		socket.off("GAME_START");
		socket.off("NEW_STAIR_CONFIG");
		socket.off("UPDATE_RIVAL");
		this.canvas.unmount();
		this.canvas = null;
	},
	methods: {
		showWinText: function() {
			this.isWin = true;
			this.emitEndGame();
		},
		showLooseText: function() {
			this.isLoose = true;
			this.emitEndGame();
		},
		emitEndGame: function() {
			socket.emit("GAME_END", {
				roomID: this.roomID
			});
			this.resetAllStatusToIdle();
		}
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
.endingText {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	font-family: "Press Start 2P";
	font-size: 40px;
	span {
		&:first-child {
			transition: 0.3s;
			opacity: 0;
		}
		&:last-child {
			transition: 0.3s 0.3s;
			opacity: 0;
		}
	}
	&.win {
		color: gold;
		text-shadow: 1px 1px 3px #ff0000, 1px 0 5px #0000ff;
		&.show {
			span {
				&:first-child {
					opacity: 1;
				}
				&:last-child {
					opacity: 1;
				}
			}
		}
	}
	&.loose {
		color: red;
		text-shadow: 1px 1px 3px gold, 1px 0 5px #0000ff;
		&.show {
			span {
				&:first-child {
					opacity: 1;
				}
				&:last-child {
					opacity: 1;
				}
			}
		}
	}
}
</style>
