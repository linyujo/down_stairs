/* eslint-disable */
import Vec2D from "@/utils/Vector2D";

const runningRightImg = new Image();
runningRightImg.src = require("@/assets/loginRunning.png");

export default class Charactor {
	constructor(args) {
		this.config = {
			width: 80,
			height: 86,
			position: new Vec2D(0, 0),
			movingX: 0,
			movingY: 0,
			direction: false, // 左邊
			v: new Vec2D(0, -0.5),
			...args
		};
		Object.assign(this, this.config);
	}
	update = () => {
		// 速度, 加速度 更新
		if (this.direction) {
			this.movingX += 4;
		} else {
			this.movingX -= 4;
		}
	};
	render = () => {
		const { ctx, width, height, position, movingX, movingY } = this;
		const drawDirection = {
			x: position.x - width / 2 + movingX,
			y: position.y - height + movingY
		};
		if (this.direction) {
			this.runningRight(drawDirection);
		} else {
			this.runningLeft(drawDirection);
		}
	}

	runningRight = drawDirection => {
		const { ctx, width, height } = this;
		ctx.drawImage(
			document.getElementById("runningCharactor"),
			0,
			0,
			width,
			height,
			drawDirection.x,
			drawDirection.y,
			width,
			height
		);
	}
	runningLeft = drawDirection => {
		const { ctx, width, height } = this;
		ctx.drawImage(
			document.getElementById("runningLeftCharactor"),
			0,
			0,
			width,
			height,
			drawDirection.x,
			drawDirection.y,
			width,
			height
		);
	}
}