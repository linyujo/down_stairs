/* eslint-disable */
import Vec2D, { getDistance } from "@/utils/Vector2D";
import Stair from "./Stair";
import Player from "./Player";
import { do_Times, playSound, stopSound } from "@/utils/utilFuncs";
import Vector2D from "../../utils/Vector2D";

function isPlayerOnAStair(stair, player) {
	/*
	 *
	 *        -----
	 *        |   |
	 *        |   |
	 *        -----
	 * |-------@-------|
	 */
	const stairLeft = stair.position.x - stair.width / 2; // 樓梯左邊的邊界
	const stairRight = stair.position.x + stair.width / 2; // 牆壁右側的邊界
	const playerLeft = player.position.x - player.width / 2; // 玩家左側的邊界
	const playerRight = player.position.x + player.width / 2; // 玩家右側的邊界

	const playerBottom = player.position.y;
	const stairTop = stair.position.y;
	const stairBottom = stair.position.y + stair.height + 10; // 10為寬容值, 避免速度太快, 沒有抓到

	let isOnTheStair = false;
	if (stairLeft < playerRight && stairRight > playerLeft) {
		// 寬度判斷
		if (playerBottom > stairTop && playerBottom < stairBottom) {
			// 高度判斷
			isOnTheStair = true;
		}
	}

	return isOnTheStair;
}

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
			myPosition: new Vec2D(0, 0),
			myKeyStatus: {
				left: false,
				right: false
			},
			// socket會傳來對手的key event
			rivalKeyStatus: {
				left: false,
				right: false
			},
			rivalPosition: new Vec2D(0, 0),
			ctx: null,
			// socket傳來的初始設定
			rivalID: "",
			rivalCharacter: 1,
			myCharacter: 2,
			roomID: 0,
			initStairConfigs: [],
			initPlayerConfigs: [],
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
		playSound("backgroundMusic", 0.8);
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

		// 階梯
		this.updateStairs();
		// 玩家與階梯互動
		// this.checkPlayerAndStairInteraction();
		// 玩家
		this.updatePlayers();
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
		this.renderRoofBlade();

		// 玩家
		this.renderPlayers();
		// 階梯
		this.renderStairs();

		this.ctx.restore();

		this.renderPlayerBlood();

		this.renderStairCount();
	};
	willUnmount = () => {
		this.isPlaying = false;
		stopSound("backgroundMusic");
		const { players, myCharacter } = this;
		const me = players[myCharacter - 1];
		if (me.blood === 0) {
			document.getElementById("looseText").click();
			playSound("gameOverSound", 0.2);
		} else {
			document.getElementById("winText").click();
			playSound("gameWinSound", 0.6);
		}
	};
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
						initStairConfigs[i].position.y
					),
					type: initStairConfigs[i].type,
					ctx: ctx
				})
			);
		});
		this.stairs = [...initStairs];
	};
	updateStairs = () => {
		const { stairs } = this;
		stairs.forEach(stair => {
			stair.update();
		});
		this.stairs = stairs.filter(stair => stair.isActive); // 遊戲只留下仍在畫面中的階梯
	};
	addNewStair = newStairConfig => {
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
	};
	renderStairs = () => {
		this.stairs.forEach(stair => {
			stair.render();
		});
	};
	createPlayers = () => {
		const { initPlayerConfigs, ctx, width } = this;
		const player1 = new Player({
			characterID: initPlayerConfigs[0].characterID,
			position: new Vec2D(
				initPlayerConfigs[0].position.x,
				initPlayerConfigs[0].position.y
			),
			ctx: ctx,
			gameWidth: width
		});

		const player2 = new Player({
			characterID: initPlayerConfigs[1].characterID,
			position: new Vec2D(
				initPlayerConfigs[1].position.x,
				initPlayerConfigs[1].position.y
			),
			ctx: ctx,
			gameWidth: width
		});

		player1.init();
		player2.init();

		this.players = [player1, player2];
	};
	updatePlayers = () => {
		const {
			width,
			height,
			myCharacter,
			myKeyStatus,
			rivalKeyStatus
		} = this;

		this.players.forEach(player => {
			checkBorder(player); // 檢查玩家是否碰到遊戲邊界

			// if (player.blood === 0) {
			// 	this.willUnmount();
			// }
			if (player.position.y > height + player.height) {
				// 如果其中一個玩家掉出遊戲高度，血量歸零
				player.blood = 0;
			}

			// player.update();
			// 如果左鍵按下，控制中的角色向左，並移動
			if (player.characterID === myCharacter) {
				movePlayer(myKeyStatus, player);
				this.myPosition = player.position;
			} else {
				adjustRivalPosition(player, this.rivalPosition);
				movePlayer(rivalKeyStatus, player);
			}
		});

		// this.checkPlayerAndStairInteraction(); // 玩家與階梯互動

		function movePlayer(keyStatus, player) {
			// 如果左鍵按下，控制中的角色向右
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
		}

		function adjustRivalPosition(player, rivalPosition) {
			if (rivalPosition.x === 0 && rivalPosition.y === 0) {
				return;
			}
			const distance = getDistance(player.position, rivalPosition);
			if (distance > 1) {
				TweenMax.to(
					player,
					1,
					{
						x: rivalPosition.x,
						y: rivalPosition.y
					}
				);
				setTimeout(() => {
					player.position = rivalPosition;
				}, 1000);	
			}
		}

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
	};
	updateRival = payload => {
		switch (payload.action) {
			case "LEFT_TRUE":
				this.rivalKeyStatus.left = true;
				this.rivalPosition = new Vec2D(
					payload.position.x,
					payload.position.y
				);
				break;
			case "RIGHT_TRUE":
				this.rivalKeyStatus.right = true;
				this.rivalPosition = new Vec2D(
					payload.position.x,
					payload.position.y
				);
				break;
			case "LEFT_FALSE":
				this.rivalKeyStatus.left = false;
				this.rivalPosition = new Vec2D(
					payload.position.x,
					payload.position.y
				);
				break;
			case "RIGHT_FALSE":
				this.rivalKeyStatus.right = false;
				this.rivalPosition = new Vec2D(
					payload.position.x,
					payload.position.y
				);
				break;
			default:
				break;
		}
	};
	renderPlayers = () => {
		this.players.forEach(player => {
			player.render();
		});
	};
	renderPlayerBlood = () => {
		this.players.forEach(player => {
			player.drawBlood();
		});
	}
	checkPlayerAndStairInteraction = () => {
		const { stairs, players } = this;

		stairs.forEach(stair => {
			players.forEach(player => {
				const isOn = isPlayerOnAStair(stair, player);
				if (isOn) {
					stairTypeInteraction(stair, player);
					stairSonud(stair, player);
					player.latestStair = stair;
				}
			});
		});

		function stairTypeInteraction(stair, player) {
			player.v.y = 0; // 角色的y速度為0
			if (stair.type !== "fade") {
				player.position.y = stair.position.y; // 角色的y座標與階梯相同，流沙除外
			}
			switch (stair.type) {
				case "jump":
					player.v.y = -10;
					stair.extraHeight = 10;
					// eslint-disable-next-line no-undef
					TweenMax.to(stair, 0.2, { extraHeight: 0 }); // 彈簧效果
					break;
				case "slideLeft":
					player.position.x -= 3;
					break;
				case "slideRight":
					player.position.x += 3;
					break;
				case "fade":
					player.position.y -= 3;
					break;
				case "blade":
					if (player.latestStair !== stair) {
						// 如果踩到的階梯 是同一個，不要重複 扣血
						player.bloodDelta(-1);
					}
					break;
				case "normal":
					if (player.latestStair !== stair) {
						// 如果踩到的階梯 是同一個，不要重複 補血
						player.bloodDelta(+1);
					}
					break;
				default:
					break;
			}
		}

		function stairSonud(stair, player) {
			if (player.latestStair === stair) {
				// 避免同一個階梯，重複播放
				return;
			}
			switch (stair.type) {
				case "normal":
					playSound("stepSound");
					break;
				case "jump":
					playSound("bounceSound");
					break;
				case "blade":
					// 受傷音效在扣血時播放
					break;
				case "slideLeft":
					playSound("transmitSound", 0.5);
					break;
				case "slideRight":
					playSound("transmitSound", 0.5);
					break;
				default:
					break;
			}
		}
	};
	renderRoofBlade = () => {
		const { ctx, width } = this;
		const span = width / 90; // 底 高 底 高 ...共16條線，每一份佔1/16的寬度

		ctx.beginPath();
		do_Times(1 + 90)(i => {
			// 起點...第一條(上)...第二條(下)...第三條(上)...    要畫 (起點)＋60條線，故含起點是 1 + 60
			ctx.lineTo(i * span, (i % 2) * 16);
		});
		ctx.fillStyle = "#ddd";

		ctx.fill();
	};
}
