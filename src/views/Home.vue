<template>
	<div class="home-view">
		<div class="home-bg"></div>
		<div id="nav">
			<ul>
				<li title="single">
					<input
						type="radio"
						value="single"
						id="tab_single"
						name="gameMode"
						class="check-with-label"
						@change="changeMode"
						:checked="gameMode === 'single'"
					/>
					<label
						for="tab_single"
						role="button"
						class="label-for-check"
					>
						<span>單人</span>
					</label>
				</li>
				<li title="dual">
					<input
						type="radio"
						value="dual"
						id="tab_dual"
						name="gameMode"
						class="check-with-label"
						@change="changeMode"
						:checked="gameMode === 'dual'"
					/>
					<label for="tab_dual" role="button" class="label-for-check">
						<span>雙人</span>
					</label>
				</li>
			</ul>
			<div :class="['slider', gameMode]">
				<div class="indicator"></div>
			</div>
		</div>
		<component :is="gameMode"></component>
		<Modal v-if="showModal" @close="showModal = false">
			<div slot="customHeader">階梯說明</div>
			<div slot="customBody">
				<div class="container">
					<div class="row">
						<li
							v-for="(stair, index) in firstTwoItems"
							v-bind:key="index"
						>
							<div class="imageBox">
								<div class="imageBox__ratio">
									<div class="image" :style="stair.src" />
								</div>
							</div>
							<div class="title">{{ stair.type }}</div>
							<div class="descript">{{ stair.descript }}</div>
						</li>
					</div>
					<div class="row">
						<li
							v-for="(stair, index) in leftItems"
							v-bind:key="index"
						>
							<div class="imageBox">
								<div class="imageBox__ratio">
									<div class="image" :style="stair.src" />
								</div>
							</div>
							<div class="title">{{ stair.type }}</div>
							<div class="descript">{{ stair.descript }}</div>
						</li>
					</div>
				</div>
			</div>
		</Modal>
	</div>
</template>

<script>
/* eslint-disable */
// @ is an alias to /src
import { mapGetters } from "vuex";

import SingleMode from "@/components/DownStairs/Single.vue";
import DualMode from "@/components/DownStairs/Dual.vue"
import Modal from "@/components/Modal/Modal.vue";
import game from "@/store/modules/gameMode";

const stairTypes = [
	{
		src: "background: url(https://imgur.com/O3r8eqB.png})",
		type: "尖刺階梯",
		descript: "傷害，血量 - 1"
	},
	{
		src: "background: url(https://imgur.com/D3edaEP.png)",
		type: "彈跳階梯",
		descript: "向上彈跳"
	},
	{
		src: "background: url(https://imgur.com/EFbSNit.png)",
		type: "彈跳階梯",
		descript: "補血，血量 + 1"
	},
	{
		src: "background: url(https://imgur.com/BCszJnB.png)",
		type: "滑動階梯",
		descript: "輸送帶，向左/向右滑動"
	},
	{
		src: "background: url(https://imgur.com/2vCGpRh.png)",
		type: "流沙階梯",
		descript: "會緩慢穿過掉下"
	}
];

export default {
	components: {
		single: SingleMode,
		dual: DualMode,
		Modal,
	},
	computed: {
		...mapGetters(["gameMode"])
	},
	watch: {
		// gameMode: function(value){
		// 	if (value === "dual") {
		// 		this.$refs.tab_dual.click();
		// 	} else {
		// 		this.$refs.tab_single.click();
		// 	}
		// }
	},
	data() {
		return {
			showModal: false,
			firstTwoItems: stairTypes.slice(0, 2),
			leftItems: stairTypes.slice(2, 5)
		};
	},
	methods: {
		changeMode() {
			this.$store.dispatch(game.actionTypes.UPDATE_GAME_MODE);
		},
	},
};
</script>

<style lang="scss" scoped>
.home-view {
	height: 100%;
}
.home-bg {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: #272727;
	// background: linear-gradient(
	// 	90deg,
	// 	rgba(0, 0, 0, 1) 0%,
	// 	rgba(83, 83, 83, 1) 80%,
	// 	rgba(171, 171, 171, 1) 100%
	// );
}
.container {
	width: 800px;
	.row {
		display: flex;
		justify-content: space-around;
	}
	.row:first-child {
		margin-bottom: 24px;
	}
}

// li {
// 	display: inline-block;
// 	list-style: none;
// 	.title {
// 		margin: 8px 0 4px 0;
// 		font-weight: bold;
// 	}
// }
.imageBox {
	width: 228px;
	overflow: hidden;
}
.imageBox .imageBox__ratio {
	width: 100%;
	padding-top: 50%;
	position: relative;
}
.imageBox .image {
	/* 定位 */
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	/* 圖片 */
	background-size: cover;
	background-position: center;
}
#nav {
	width: 200px;
	margin: 0 auto;
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	z-index: 1;
	ul{
		list-style-type: none;
		display: flex;
		justify-content: center;
		padding-left: 0;
		margin-bottom: 0;
		li{
			padding: 10px;
		}
	}
	input[name="gameMode"] {
		display: none;
	}
	.label-for-check {
		width: 100px;
		padding: 10px;
		text-align: center;
		color: grey;
		padding: 5px auto;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		&:hover{
			color: white;
		}
	}
	.check-with-label:checked + .label-for-check {
		color: #31B404;
		font-weight: bold;
	}
}
.slider{
	width: 100%;
	.indicator {
      	height: 4px;
		width: 50px;
		background: #31B404;
		border-radius: 1px;
		transition: all 0.3s ease-in-out;
    }
	&.single{
		.indicator{
			transform: translateX(75%);
		}
	}
	&.dual{
		.indicator{
			transform: translateX(220%);
		}
	}
}
</style>
