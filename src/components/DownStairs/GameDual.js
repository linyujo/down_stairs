/* eslint-disable */
import Vec2D from "@/utils/Vector2D";
import Stair from "./Stair";
import {
	do_Times,
	// playSound,
	// stopSound,
	// weightedRandom
} from "@/utils/utilFuncs";

export default class DualGame {
	constructor(args) {
		this.default = {
			stairs: [],
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
		// this.updatePlayers();
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
		// this.renderPlayers();
		// 階梯
		this.renderStairs();

		this.ctx.restore();

		// this.renderPlayerBlood();

		// this.renderStairCount();
	}
	willUnmount = () => {
		this.isPlaying = false;
		// document.getElementById("startButton").click();
	}
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
		this.players = [
			new Player({
				playerID: 1,
				position: new Vec2D(
					initPlayerConfigs[0].position.x,
					initPlayerConfigs[0].position.y,
				),
				ctx: this.ctx,
				gameWidth: this.width
			}),
			new Player({
				playerID: 2,
				position: new Vec2D(
					initPlayerConfigs[1].position.x,
					initPlayerConfigs[1].position.y,
				),
				ctx: this.ctx,
				gameWidth: this.width
			}),
		];
	};
}
