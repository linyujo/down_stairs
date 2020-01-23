// 建立Canvas
export default class Canvas {
	id;
	canvas;
	width;
	height;
	ctx;
	time = 0;
	updateFPS = 30;

	constructor(id) {
		this.id = id;
	}

	set width(w) {
		this.width = w;
	}

	set height(h) {
		this.height = h;
	}

	init() {
		this._initCanvas();
		requestAnimationFrame(this.render);
		setInterval(this.update, 1000 / this.updateFPS);
	}
	update() {
		this.time++;
	}
	render() {
		requestAnimationFrame(this.render);
	}
	_initCanvas() {
		if (!this.id) {
			throw new Error('canvas id is not defined');
		}
		if (!this.width || !this.height) {
			throw new Error('canvas width or canvas height is not defined');
		}
		this.canvas = document.getElementById(this.id);
		this.ctx = this.canvas.getContext('2d');
		this.canvas.width = this.width;
		this.canvas.height = this.height;
	}
}
