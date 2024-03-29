import Vec2D from "@/utils/Vector2D";
import { do_Times, playSound } from "@/utils/utilFuncs";
import { PlayerOne, PlayerTwo } from "./MotionCanvas";

const INITIAL_RECOVER_COUTER = 30;

export default class Player {
	constructor(args) {
		this.config = {
			width: 80,
			height: 86,
			position: new Vec2D(0, 0),
			v: new Vec2D(0, 0),
			a: new Vec2D(0, 0.6),
			characterID: 1, // 幾號角色
			playerMotion: null, // 角色動作
			blood: 10, // 目前血量
			maxBlood: 10, // 總血量
			latestStair: null, // 目前踩到的階梯(避免踩到 刀山，重複扣血)
			isTouchedRoof: false, // 是否碰到天花板
			direction: true, // 向右為true, 向左為false
			isRunning: false, // 是否在跑步中
			isHurt: false, // 是否扣血了
			recoverCounter: INITIAL_RECOVER_COUTER,
			gameWidth: 0,
			...args
		};
		Object.assign(this, this.config);
	}
	init = () => {
		this.playerMotion = this.characterID === 1 ? PlayerOne : PlayerTwo;
	};
	update = () => {
		// 速度, 加速度 更新
		this.position = this.position.add(this.v);
		this.v = this.v.add(this.a);

		// 受傷復原
		if (this.isHurt) {
			this.recoverFromInjury();
		}

		if (this.position.y - this.height < 2) {
			// 玩家碰到天花板
			this.touchedRoof();
		}
	};
	render = () => {
		const { position, width, height, isRunning, isHurt } = this;
		const drawDirection = {
			x: position.x - width / 2,
			y: position.y - height
		};

		let isStepOnStair = false;
		if (this.v.y === 0) {
			isStepOnStair = true;
		}

		if (this.direction) {
			// 向右
			if (isHurt) {
				// 受傷0
				this.hurtedRight(drawDirection);
				return;
			}
			if (!isStepOnStair) {
				// 角色不是踩在階梯上
				this.jumpRight(drawDirection);
			} else {
				if (isRunning) {
					this.walkRight(drawDirection);
				} else {
					this.standRight(drawDirection);
				}
			}
		} else {
			// 向左
			if (isHurt) {
				// 受傷
				this.hurtedLeft(drawDirection);
				return;
			}
			if (!isStepOnStair) {
				this.jumpLeft(drawDirection);
			} else {
				if (isRunning) {
					this.walkLeft(drawDirection);
				} else {
					this.standLeft(drawDirection);
				}
			}
		}
	};
	hurtedLeft = drawDirection => {
		const { ctx, width, height, playerMotion } = this;
		ctx.drawImage(
			playerMotion.hurtLeft,
			0,
			0,
			width,
			height,
			drawDirection.x,
			drawDirection.y,
			width,
			height
		);
	};
	hurtedRight = drawDirection => {
		const { ctx, width, height, playerMotion } = this;
		ctx.drawImage(
			playerMotion.hurtRight,
			0,
			0,
			width,
			height,
			drawDirection.x,
			drawDirection.y,
			width,
			height
		);
	};
	walkRight = drawDirection => {
		const { ctx, width, height, playerMotion } = this;
		ctx.drawImage(
			playerMotion.walkRight,
			0,
			0,
			width,
			height,
			drawDirection.x,
			drawDirection.y,
			width,
			height
		);
	};
	walkLeft = drawDirection => {
		const { ctx, width, height, playerMotion } = this;
		ctx.drawImage(
			playerMotion.walkLeft,
			0,
			0,
			width,
			height,
			drawDirection.x,
			drawDirection.y,
			width,
			height
		);
	};
	jumpRight = drawDirection => {
		const { ctx, width, height, playerMotion } = this;
		ctx.drawImage(
			playerMotion.jumpRight,
			0,
			0,
			width,
			height,
			drawDirection.x,
			drawDirection.y,
			width,
			height
		);
	};
	jumpLeft = drawDirection => {
		const { ctx, width, height, playerMotion } = this;
		ctx.drawImage(
			playerMotion.jumpLeft,
			0,
			0,
			width,
			height,
			drawDirection.x,
			drawDirection.y,
			width,
			height
		);
	};
	standRight = drawDirection => {
		const { ctx, width, height, playerMotion } = this;

		ctx.drawImage(
			playerMotion.standRight,
			0,
			0,
			width,
			height,
			drawDirection.x,
			drawDirection.y,
			width,
			height
		);
	};
	standLeft = drawDirection => {
		const { ctx, width, height, playerMotion } = this;

		ctx.drawImage(
			playerMotion.standLeft,
			0,
			0,
			width,
			height,
			drawDirection.x,
			drawDirection.y,
			width,
			height
		);
	};
	drawBlood = () => {
		const {
			ctx,
			blood,
			maxBlood,
			gameWidth,
			characterID,
			playerMotion
		} = this;

		const headWidth = 40; // 頭像寬
		const headHeight = 42; // 頭像高

		// 血量條旁邊的頭像 = 1號玩家 距離左邊10px : 2號玩家 距離右邊10px
		const headPositionX =
			characterID === 1 ? 10 : gameWidth - (10 + headWidth);

		ctx.drawImage(
			playerMotion.head,
			0,
			0,
			playerMotion.head.width,
			playerMotion.head.height,
			headPositionX,
			5,
			headWidth,
			headHeight
		);

		// 血量條 = 1號玩家 頭像的位置 + 60px : 2號玩家 頭像再往左185
		const bloodPosition =
			characterID === 1 ? headPositionX + 60 : headPositionX - 185;

		do_Times(maxBlood)(i => {
			const color = i < blood ? "red" : "#848484";
			ctx.fillStyle = color;
			const bw = 15; // 每格血量寬度
			const gap = 4; // 血格 與 血格 之間的間隙
			const beginX = bloodPosition + i * bw + gap * (i - 1);
			ctx.fillRect(beginX, 15, 10, 30);
		});
	};
	bloodDelta = delta => {
		const { blood, maxBlood } = this;
		if (delta > 0) {
			this.blood += blood < maxBlood ? delta : 0;
		}
		if (delta < 0) {
			// 扣血
			this.blood += delta;
			this.isHurt = true;
			playSound("stabSound");
		}
		// if (blood > maxBlood) {
		// 	this.blood = maxBlood;
		// }
		if (blood < 0) {
			this.blood = 0;
			// 遊戲結束
		}
	};
	recoverFromInjury = () => {
		if (this.recoverCounter > 0) {
			this.recoverCounter--;
		} else {
			this.isHurt = false;
			this.recoverCounter = INITIAL_RECOVER_COUTER;
		}
	}
	touchedRoof = () => {
		if (!this.isTouchedRoof) {
			this.isTouchedRoof = true; // 避免重複扣血
			this.bloodDelta(-1);
			this.v.y = 2;
			this.position.y = 10; // 強制把y位置推到10
			setTimeout(() => {
				this.isTouchedRoof = false; // 500毫秒後，恢復成false
			}, 500);
		}
	};
}
