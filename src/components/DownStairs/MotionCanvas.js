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

// 頭
PlayerOne.head = document.createElement("img");
PlayerOne.head.src = require("@/assets/player1/head.png");

/**
 * PlayerTwo
 */
const PlayerTwo = {};

// 站立 向右
PlayerTwo.standRight = document.createElement("canvas");
new PlayerAction({
	node: PlayerTwo.standRight,
	imgSrc: require("@/assets/player2/standRight.png")
}).init();

// 站立 向左
PlayerTwo.standLeft = document.createElement("canvas");
new PlayerAction({
	node: PlayerTwo.standLeft,
	imgSrc: require("@/assets/player2/standLeft.png")
}).init();

// 走路 向右
PlayerTwo.walkRight = document.createElement("canvas");
new PlayerAction({
	node: PlayerTwo.walkRight,
	imgSrc: require("@/assets/player2/walkRight.png"),
	frameCountDelay: 4
}).init();

// 走路 向左
PlayerTwo.walkLeft = document.createElement("canvas");
new PlayerAction({
	node: PlayerTwo.walkLeft,
	imgSrc: require("@/assets/player2/walkLeft.png"),
	frameCountDelay: 4
}).init();

// 受傷 向右
PlayerTwo.hurtRight = document.createElement("canvas");
new PlayerAction({
	node: PlayerTwo.hurtRight,
	imgSrc: require("@/assets/player2/hurtedRight.png"),
	frameCountDelay: 4,
	isInfinite: false
}).init();

// 受傷 向左
PlayerTwo.hurtLeft = document.createElement("canvas");
new PlayerAction({
	node: PlayerTwo.hurtLeft,
	imgSrc: require("@/assets/player2/hurtedLeft.png"),
	frameCountDelay: 4,
	isInfinite: false
}).init();

// 跳躍 向右
PlayerTwo.jumpRight = document.createElement("img");
PlayerTwo.jumpRight.src = require("@/assets/player2/jumpRight.png");

// 跳躍 向左
PlayerTwo.jumpLeft = document.createElement("img");
PlayerTwo.jumpLeft.src = require("@/assets/player2/jumpLeft.png");

// 頭
PlayerTwo.head = document.createElement("img");
PlayerTwo.head.src = require("@/assets/player2/head.png");

export { PlayerOne, PlayerTwo };
