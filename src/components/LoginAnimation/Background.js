/* eslint-disable */
import Vec2D from "@/utils/Vector2D";

const bgImage = new Image();
bgImage.src = require("@/assets/band.svg");

export default class Background {
	constructor(args) {
		this.config = {
			x: 0,
			y: 0,
			width: 0,
			height: 0,
			ctx: null,
			...args
		};
		Object.assign(this, this.config);
	}
	render = () => {
		const { ctx, width, height, position, movingX, movingY } = this;

		ctx.drawImage(
			bgImage,
			this.x,
			this.y--,
		);

		if (this.y <= - 256) {
			this.y = 0;
		}
	}
}