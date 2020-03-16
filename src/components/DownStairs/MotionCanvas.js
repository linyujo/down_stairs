import PlayerAction from "./PlayerAction";

/**
 * PlayerOne
 */

const PlayerOne = {};

// 站立 向右
PlayerOne.standRight = document.createElement("canvas");
new PlayerAction({
	node: PlayerOne.standRight,
	imgSrc: require("@/assets/player1/standRight.png")
}).init();

// 站立 向左
PlayerOne.standLeft = document.createElement("canvas");
new PlayerAction({
	node: PlayerOne.standLeft,
	imgSrc: require("@/assets/player1/standLeft.png")
}).init();

// 走路 向右
PlayerOne.walkRight = document.createElement("canvas");
new PlayerAction({
	node: PlayerOne.walkRight,
	imgSrc: require("@/assets/player1/walkRight.png"),
	frameCountDelay: 4
}).init();

// 走路 向左
PlayerOne.walkLeft = document.createElement("canvas");
new PlayerAction({
	node: PlayerOne.walkLeft,
	imgSrc: require("@/assets/player1/walkLeft.png"),
	frameCountDelay: 4
}).init();

// 受傷 向右
PlayerOne.hurtRight = document.createElement("canvas");
new PlayerAction({
	node: PlayerOne.hurtRight,
	imgSrc: require("@/assets/player1/hurtedRight.png"),
	frameCountDelay: 4,
	isInfinite: false
}).init();

// 受傷 向左
PlayerOne.hurtLeft = document.createElement("canvas");
new PlayerAction({
	node: PlayerOne.hurtLeft,
	imgSrc: require("@/assets/player1/hurtedLeft.png"),
	frameCountDelay: 4,
	isInfinite: false
}).init();

// 跳躍 向右
PlayerOne.jumpRight = document.createElement("img");
PlayerOne.jumpRight.src = require("@/assets/player1/jumpRight.png");

// 跳躍 向左
PlayerOne.jumpLeft = document.createElement("img");
PlayerOne.jumpLeft.src = require("@/assets/player1/jumpLeft.png");

export { PlayerOne };
