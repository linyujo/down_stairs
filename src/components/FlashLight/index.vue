<template>
	<div class="flashLight-wrapper" ref="flashLightWrapper">
		<canvas
			ref="flashLight"
			v-bind:style="canvasStyle"
			:width="appendWidth"
			:height="appendHeight"
		></canvas>
		<div :class="['cat-wrapper', isBlur ? 'show' : '']">
			<div class="cat">
				<div class="ear ear--left"></div>
				<div class="ear ear--right"></div>
				<div class="face">
					<div class="eye eye--left">
						<div class="eye-pupil"></div>
					</div>
					<div class="eye eye--right">
						<div class="eye-pupil"></div>
					</div>
					<div class="muzzle"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
class FlashLight {
	node;
	ctx;
	width;
	height;
	centerPoint;
	mousePosition;
	flashlight_size;
	gradient_color = {
		first: "rgba(0,0,0,0.8)",
		second: "rgba(0,0,0,0)"
	};
	gradient;
	isDrawing = true;
	constructor(node, width, height) {
		this.node = node;
		this.ctx = this.node.getContext("2d");
		this.width = this.node.width = width;
		this.height = this.node.height = height;
	}
	init = () => {
		const { width, height } = this;

		this.centerPoint = {
			x: width / 2,
			y: height / 2
		};
		this.mousePosition = {
			x: width / 2,
			y: height / 2
		};
		this.flashlight_size = {
			center: height / 5,
			outside: height / 3
		};

		// this.render();
		requestAnimationFrame(this.render);
	};
	render = () => {
		const {
			ctx,
			width,
			height,
			mousePosition,
			flashlight_size,
			gradient_color
		} = this;

		ctx.save();
		ctx.clearRect(0, 0, width, height);

		this.gradient = ctx.createRadialGradient(
			mousePosition.x,
			mousePosition.y,
			flashlight_size.center,
			mousePosition.x,
			mousePosition.y,
			flashlight_size.outside
		);
		this.gradient.addColorStop(0, gradient_color.first);
		this.gradient.addColorStop(1, gradient_color.second);

		ctx.fillStyle = "#272727";
		ctx.fillRect(0, 0, width, height);

		if (this.isDrawing) {
			ctx.globalCompositeOperation = "destination-out";
			ctx.fillStyle = this.gradient;
			ctx.arc(
				mousePosition.x,
				mousePosition.y,
				flashlight_size.outside,
				0,
				Math.PI * 2,
				false
			);
		}

		ctx.fill();

		ctx.restore();
	};
	handleMouseMove = evt => {
		this.mousePosition.x = evt.offsetX;
		this.mousePosition.y = evt.offsetY;
		this.isDrawing = true;
		requestAnimationFrame(this.render);
	};
	handleMouseOut = () => {
		this.isDrawing = false;
		requestAnimationFrame(this.render);
	};
}
export default {
	props: ["appendWidth", "appendHeight"],
	data: function() {
		return {
			canvasStyle: {
				position: "absolute",
				top: 0,
				left: 0,
				zIndex: 1
			},
			flashLight: null,
			isBlur: false
		};
	},
	mounted: function() {
		this.initFlashLight();
	},
	beforeUpdate: function() {
		this.initFlashLight();
	},
	beforeDestroy: function() {
		this.$refs.flashLightWrapper.removeEventListener(
			"mousemove",
			this.handleMouseMove
		);
		this.$refs.flashLightWrapper.removeEventListener(
			"mouseout",
			this.handleMouseOut
		);
		this.flashLight = null;
	},
	methods: {
		initFlashLight: function() {
			if (this.flashLight) {
				return;
			}
			if (!this.appendWidth && !this.appendHeight) {
				return;
			}
			this.flashLight = new FlashLight(
				this.$refs.flashLight,
				this.appendWidth,
				this.appendHeight
			);
			this.flashLight.init();
			this.$refs.flashLightWrapper.addEventListener(
				"mousemove",
				this.handleMouseMove
			);
			this.$refs.flashLightWrapper.addEventListener(
				"mouseout",
				this.handleMouseOut
			);
		},
		handleMouseMove: function(evt) {
			this.isBlur = false;
			this.flashLight.handleMouseMove(evt);
		},
		handleMouseOut: function() {
			this.isBlur = true;
			this.flashLight.handleMouseOut();
		}
	}
};
</script>

<style lang="scss" scoped>
$color-black: #272727;
$color-white: #fff;
$size: 170px; // (Fully responsive)

.flashLight-wrapper {
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	.cat-wrapper {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		opacity: 0;
		transition: opacity 0.1s;
		&.show {
			opacity: 1;
			z-index: 1;
		}
	}
}

.cat {
	position: relative;
	height: $size;
	width: $size * 1.13;
}

// Ears
.ear {
	position: absolute;
	top: -30%;
	height: 60%;
	width: 25%;
	background: $color-white;
	&.ear--left {
		left: -7%;
		border-radius: 70% 30% 0% 0% / 100% 100% 0% 0%;
		transform: rotate(-15deg);
	}
	&.ear--right {
		right: -7%;
		border-radius: 30% 70% 0% 0% / 100% 100% 0% 0%;
		transform: rotate(15deg);
	}
}

// Face
.face {
	position: absolute;
	height: 100%;
	width: 100%;
	background: $color-black;
	border-radius: 50%;
}

// Eyes
.eye {
	position: absolute;
	top: 35%;
	height: 30%;
	width: 31%;
	background: $color-white;
	border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
	&.eye--left {
		left: 0;
	}
	&.eye--right {
		right: 0;
	}
	// 眼皮
	&::after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		height: 0;
		width: 100%;
		border-radius: 0 0 50% 50% / 0 0 40% 40%;
		background: $color-black;
		animation: blink 4s infinite ease-in;
	}
	@keyframes blink {
		0% {
			height: 0;
		}
		90% {
			height: 0;
		}
		// 92.5% { height: 100%; }
		// 95% { height: 0; }
		97.5% {
			height: 100%;
		}
		100% {
			height: 0;
		}
	}
}

// 眼珠
.eye-pupil {
	position: absolute;
	top: 25%;
	height: 50%;
	width: 20%;
	background: $color-black;
	border-radius: 50%;
	animation: look-around 4s infinite;

	@keyframes look-around {
		0% {
			transform: translate(0);
		}
		5% {
			transform: translate(50%, -25%);
		}
		10% {
			transform: translate(50%, -25%);
		}
		15% {
			transform: translate(-100%, -25%);
		}
		20% {
			transform: translate(-100%, -25%);
		}
		25% {
			transform: translate(0, 0);
		}
		100% {
			transform: translate(0, 0);
		}
	}

	.eye--left & {
		right: 30%;
	}
	.eye--right & {
		left: 30%;
	}
	// 眼白
	&::after {
		content: "";
		position: absolute;
		top: 30%;
		right: -5%;
		height: 20%;
		width: 35%;
		border-radius: 50%;
		background: $color-white;
	}
}

// nose
.muzzle {
	position: absolute;
	top: 60%;
	left: 50%;
	height: 6%;
	width: 10%;
	background: $color-white;
	transform: translateX(-50%);
	border-radius: 50% 50% 50% 50% / 30% 30% 70% 70%;
}
</style>
