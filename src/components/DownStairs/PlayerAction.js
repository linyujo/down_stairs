export default class PlayerAction {
	constructor(args) {
		this.config = {
			node: null,
			img: null,
			imgSrc: "",
			width: 80,
			height: 86,
			posIndexes: [0, 80, 160, 240, 320, 400],
			currentPos: 0,
			frameCount: 0,
			frameCountDelay: 15,
			isInfinite: true,
			...args
		};
		Object.assign(this, this.config);
	}
	init = () => {
		this.node.width = this.width;
		this.node.height = this.height;

		this.ctx = this.node.getContext("2d");

		this.img = new Image();
		this.img.src = this.imgSrc;

		requestAnimationFrame(this.render);
	};
	render = () => {
		const {
			frameCount,
			frameCountDelay,
			ctx,
			width,
			height,
			img,
			posIndexes,
			currentPos
		} = this;

		// 減緩渲染速度
		this.frameCount++;
		if (frameCount < frameCountDelay) {
			requestAnimationFrame(this.render);
			return;
		}
		this.frameCount = 0;

		// 清空背景
		ctx.clearRect(0, 0, width, height);
		ctx.drawImage(
			img,
			posIndexes[currentPos],
			0,
			width,
			height,
			0,
			0,
			width,
			height
		);

		// 下一個動作
		this.currentPos++;

		const lastPos = posIndexes.length - 1;
		if (currentPos === lastPos) {
			this.currentPos = 0;
		}

		if (currentPos === lastPos && !this.isInfinite) {
			// 如果已達最後一張，且不是無限播放
			return;
		}
		requestAnimationFrame(this.render);
	};
}
