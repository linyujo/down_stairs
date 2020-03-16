/* eslint-disable */
import Vec2D from "@/utils/Vector2D";
import Stair from "./Stair";
import Player from "./Player";
import {
	do_Times,
	// playSound,
	// stopSound,
	// weightedRandom
} from "@/utils/utilFuncs";
import socket from "@/socket";

export default class DualGame {
	constructor(args) {
		this.default = {
			stairs: [],
			players: [],
			width: 800,
			height: 600,
			gameHeight: 540,
			isPlaying: false,
			time: 0,
			keyStatus: {
				left: false,
				right: false,
				space: false // 暫停
			},
			controlledPlayerID: 1,
			ctx: null,
			initStairConfigs: [],
			initPlayerConfigs: {},
			...args
		};
		Object.assign(this, this.default);
	}
	willInit = () => {
		this.init();
		this.isPlaying = true;
		this.time = 0;
	};
	init = () => {
		// 音樂
		// playSound("backgroundMusic", 0.8);
		// 玩家
		this.createPlayers();
		// 樓梯
		this.createStairs();
	};
	update = () => {
		if (!this.isPlaying) {
			// 遊戲結束不要更新
			return;
		}
		// 時間
		this.time++;
		// 玩家
		this.updatePlayers();
		// 階梯
		this.updateStairs();
		// 玩家與階梯互動
		// this.checkPlayerAndStairInteraction();
	};
	render = () => {
		this.ctx.save();
		/**
		 * 遊戲邊界
		 */
		this.ctx.beginPath();

		this.ctx.moveTo(0, 60);
		this.ctx.lineTo(this.width, 60);
		this.ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
		this.ctx.stroke();

		this.ctx.translate(0, 60); // 遊戲往下移60px

		// 天花板刀山
		// this.renderRoofBlade();

		// 玩家
		this.renderPlayers();
		// 階梯
		this.renderStairs();

		this.ctx.restore();

		this.renderPlayerBlood();

		this.renderStairCount();
	}
	willUnmount = () => {
		this.isPlaying = false;
		// document.getElementById("startButton").click();
	}
	renderStairCount = () => {
		const { ctx, time } = this;
		ctx.font = "30px STHeiti, Microsoft JhengHei";
		ctx.fillStyle = "white";
		ctx.fillText(`地下${parseInt(time / 100)}階`, 350, 40);
	};
	createStairs = () => {
		const { ctx, initStairConfigs } = this;
		this.stairs = [];

		let initStairs = [];
		do_Times(5)(i => {
			initStairs.push(
				new Stair({
					position: new Vec2D(
						initStairConfigs[i].position.x,
						initStairConfigs[i].position.y,
					),
					type: initStairConfigs[i].type,
					ctx: ctx
				})
			);
		});
		this.stairs = [...initStairs];
	}
	updateStairs = () => {
		const { stairs, time, width, height, stairTypes } = this;
		stairs.forEach(stair => {
			stair.update();
		});
		this.stairs = stairs.filter(stair => stair.isActive); // 遊戲只留下仍在畫面中的階梯
	}
	addNewStair = (newStairConfig) => {
		const { stairs, ctx } = this;
		this.stairs = [
			...stairs,
			new Stair({
				position: new Vec2D(
					newStairConfig.position.x,
					newStairConfig.position.y
				), // 讓階梯集中中央
				type: newStairConfig.type,
				ctx: ctx
			})
		];
	}
	renderStairs = () => {
		this.stairs.forEach(stair => {
			stair.render();
		});
	};
	createPlayers = () => {
		const { initPlayerConfigs, ctx, width } = this;
		const player1 = new Player({
			playerID: initPlayerConfigs[0].playerID,
			position: new Vec2D(
				initPlayerConfigs[0].position.x,
				initPlayerConfigs[0].position.y,
			),
			ctx: ctx,
			gameWidth: width
		});

		const player2 = new Player({
			playerID: initPlayerConfigs[1].playerID,
			position: new Vec2D(
				initPlayerConfigs[1].position.x,
				initPlayerConfigs[1].position.y,
			),
			ctx: ctx,
			gameWidth: width
		});

		player1.init();
		player2.init();

		this.players = [player1, player2];
	};
	updatePlayers = () => {
		const { width, height, controlledPlayerID, roomID, keyStatus } = this;
		this.players.forEach(player => {
			checkBorder(player);
			if (player.playerID !== controlledPlayerID) {
				return;
			}
			// 如果左鍵按下，控制中的角色向左，並移動
			if (keyStatus.left) {
				player.direction = false;
				player.isRunning = true;
				player.position.x -= 8; // 往左
			}
			// 如果右鍵按下，控制中的角色向右
			if (keyStatus.right) {
				player.direction = true;
				player.isRunning = true;
				player.position.x += 8; // 往右
			}
			if (!keyStatus.left && !keyStatus.right) {
				player.isRunning = false;
			}
			socket.emit("UPDATE_RIVAL", {
				roomID: roomID,
				playerID: controlledPlayerID,
				position: player.position,
				direction: player.direction,
				isRunning: player.isRunning,
				isHurt: player.isHurt,
				blood: player.blood,
			});
		});
		function checkBorder(player) {
			if (player.position.x - player.width / 2 < 0) {
				// 檢查玩家是否超出左邊界
				player.position.x = 0 + player.width / 2;
			}
			if (player.position.x + player.width / 2 > width) {
				// 檢查玩家是否超出右邊界
				player.position.x = width - player.width / 2;
			}
		}
	}
	renderPlayers = () => {
		this.players.forEach(player => {
			player.render();
		});
	};
	renderPlayerBlood = () => {
		this.players.forEach(player => {
			player.drawBlood();
		});
	};
}
