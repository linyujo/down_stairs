import Vec2D from "@/utils/Vector2D";
import Stair from "./Stair";
import Player from "./Player";
import {
	do_Times,
	playSound,
	stopSound,
	weightedRandom
} from "@/utils/utilFuncs";
import TweenMax from "gsap/TweenMax";

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

export default class Game {
	constructor(args) {
		this.players = [];
		this.stairs = [];
		this.width = 800;
		this.height = 600;
		this.gameHeight = 540; // 上方要顯示血量
		this.stairTypes = [
			"normal",
			"slideLeft",
			"slideRight",
			"blade",
			"jump",
			"fade"
		];
		this.hurtMaskOpacity = 0;
		this.isPlaying = false;
		this.time = 0;
		this.keyStatus = {
			left: false,
			right: false,
			space: false // 暫停
		};
		this.game = null;
		this.controlledPlayerID = 1;
		this.ctx = args.ctx;
	}
	willInit = () => {
		this.init();
		this.isPlaying = true;
		this.time = 0;
	};
	init = () => {
		// 音樂
		playSound("backgroundMusic", 0.3);
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
		this.checkPlayerAndStairInteraction();
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
		playSound("gameOverSound", 0.2);
		stopSound("backgroundMusic");
		document.getElementById("startButton").click();
	};
	createStairs = () => {
		const { ctx, stairTypes } = this;
		this.stairs = [];
		const stairInterval = 150; // 階梯間隔

		const easyStairs = stairTypes.slice(0, 2);

		let initStairs = [];
		// 先新增6個階梯
		do_Times(6)(i => {
			initStairs.push(
				new Stair({
					position: new Vec2D(
						Math.random() * (this.width - 150) + 75, // 讓階梯集中中央
						i * stairInterval + 100 // 階梯高度依據index分佈
					),
					type: easyStairs[parseInt(Math.random() * easyStairs.length)],
					ctx: ctx
				})
			);
		});
		this.stairs = [...initStairs];
	};
	updateStairs = () => {
		const { stairs, time, width, height, stairTypes } = this;
		stairs.forEach(stair => {
			stair.update();
		});
		this.stairs = stairs.filter(stair => stair.isActive); // 遊戲只留下仍在畫面中的階梯

		const floor = parseInt(time / 100);

		// 每隔25毫秒，新增一個階梯
		if (time % 25 === 0) {
			let appearWeights; // 權重
			if (floor <= 10) {
				appearWeights = [25, 15, 15, 20, 20, 5];
			}
			if (floor > 10) {
				appearWeights = [20, 15, 15, 20, 20, 10];
			}
			if (floor > 20) {
				appearWeights = [15, 15, 15, 20, 20, 15];
			}
			if (floor > 40) {
				appearWeights = [10, 15, 15, 20, 20, 20];
			}
			if (floor > 60) {
				appearWeights = [10, 10, 10, 20, 25, 25];
			}
			this.stairs = [
				...stairs,
				new Stair({
					position: new Vec2D(Math.random() * (width - 150) + 75, height), // 讓階梯集中中央
					type: weightedRandom(stairTypes, appearWeights),
					ctx: this.ctx
				})
			];
		}
	};
	renderStairs = () => {
		this.stairs.forEach(stair => {
			stair.render();
		});
	};
	createPlayers = () => {
		this.players = [
			new Player({
				position: new Vec2D(this.width / 2, 200),
				ctx: this.ctx,
				gameWidth: this.width
			})
		];
	};
	updatePlayers = () => {
		const { width, height, controlledPlayerID, keyStatus } = this;
		this.players.forEach(player => {
			player.update();
			checkBorder(player);
			if (player.blood === 0) {
				this.willUnmount();
			}
			if (player.position.y > height + player.height) {
				// 如果其中一個玩家掉出遊戲高度，血量歸零
				player.blood = 0;
			}
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
	};
	renderStairCount = () => {
		const { ctx, time } = this;
		ctx.font = "30px STHeiti, Microsoft JhengHei";
		ctx.fillStyle = "white";
		ctx.fillText(`地下${parseInt(time / 100)}階`, 350, 40);
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
	checkPlayerAndStairInteraction = () => {
		const { stairs, players } = this;

		stairs.forEach(stair => {
			players.forEach(player => {
				const isOn = isPlayerOnAStair(stair, player);
				if (isOn) {
					stairTypeInteraction(stair, player);
					stairSonud(stair, player);
					player.currentStair = stair;
				}
			});
		});

		function stairSonud(stair, player) {
			if (player.currentStair === stair) {
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
					playSound("transmitSound");
					// playSound_Times('transmitSound', 3);
					break;
				case "slideRight":
					playSound("transmitSound");
					// playSound_Times('transmitSound', 3);
					break;
				default:
					break;
			}
		}

		function stairTypeInteraction(stair, player) {
			player.v.y = 0; // 角色的y速度為0
			if (stair.type !== "fade") {
				player.position.y = stair.position.y; // 角色的y座標與階梯相同，流沙除外
			}
			switch (stair.type) {
				case "jump":
					player.v.y = -10;
					stair.extraHeight = 10;
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
					if (player.currentStair !== stair) {
						// 如果踩到的階梯 是同一個，不要重複 扣血
						player.bloodDelta(-1);
					}
					break;
				case "normal":
					if (player.currentStair !== stair) {
						// 如果踩到的階梯 是同一個，不要重複 補血
						player.bloodDelta(+1);
					}
					break;
				default:
					break;
			}
		}
	};
}
