/* eslint-disable */
import Vec2D from "@/utils/Vector2D";
import Background from "./Background";
import Charactor from "./Charactor";
import {
	do_Times
} from "@/utils/utilFuncs";
import TweenMax, { Elastic } from "gsap/TweenMax";

export default class Animation {
	constructor(args) {
		this.config = {
			time: 0,
			...args,
			bg: null,
			stairs: [],
		};
		Object.assign(this, this.config);
	}
	init = () => {
		this.time = 0;
		this.createBackground();
		this.createCharactor();
	}
	update = () => {
		// 時間
		this.time++;
		this.updateStairs();
		this.updateCharactor();
	}
	render = () => {
		this.ctx.save();

		// 地板
		this.renderStairs();
		// 角色
		this.renderCharactor();

		this.ctx.restore();
	}
	createBackground = () => {
		this.stairs = [];
		let initStairs = [];

		const { width, height } = this;

		this.bg = new Background({
			ctx: this.ctx,
			width: width,
			height: height,
		});
	}
	renderStairs = () => {
		const { ctx, width, height, time } = this;

		this.bg.render();

	}
	updateStairs = () => {
		// this.stairs.forEach(stair => {
		// 	stair.update();
		// });
		// this.stairs = this.stairs.filter(stair => stair.isActive); // 遊戲只留下仍在畫面中的階梯

		// const stair = new Stair({
		// 	position: new Vec2D(this.width, this.height), // 讓階梯集中中央
		// 	ctx: this.ctx
		// });

		// TweenMax.to(stair, 5, {
		// 	movingX: - (550 + 75),
		// 	movingY: - (200 + 10),
		// 	ease: Power0.easeNone,
		// });

		// if (this.time % 45 === 0) {
		// 	this.stairs = [
		// 		...this.stairs,
		// 		stair
		// 	];
		// }
	}
	createCharactor = () => {

		this.charactor = new Charactor({
			position: new Vec2D(this.width - 100, 150),
			ctx: this.ctx,
		});
		// TweenMax.from(this.charactor, 4, {
		// 	movingX: this.width - 200,
		// 	movingY: this.height / 10,
		// 	ease: Power0.easeNone,
		// });
		// TweenMax.to(this.charactor, 4, {
		// 	direction: true,
		// 	movingX: this.width - 200,
		// 	movingY: this.height / 10,
		// 	ease: Power0.easeNone,
		// 	delay: 4,
		// });
	}
	renderCharactor = () => {
		this.charactor.render();
	}
	updateCharactor = () => {
		this.charactor.update();
		if (this.time % 80 === 0) {
			this.charactor.direction = !this.charactor.direction;
		}
	}
}
