<template>
	<div class="home-view">
		<div class="home-bg"></div>
		<div id="nav">
			<ul>
				<li title="single" @mouseover="handleMouseOver('single')">
					<router-link to="/single">
						<img :src="singleIcon" alt="單人" />
						<div class="link-desc">單人</div>
					</router-link>
				</li>
				<li title="dual" @mouseover="handleMouseOver('dual')">
					<router-link to="/dual">
						<img :src="dualIcon" alt="雙人" />
						<div class="link-desc">雙人</div>
					</router-link>
				</li>
			</ul>
			<div :class="['slider', hoveredLink]">
				<div class="indicator"></div>
			</div>
		</div>
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
		Modal,
	},
	data() {
		return {
			singleIcon: require("@/assets/home/single.png"),
			dualIcon: require("@/assets/home/dual.png"),
			hoveredLink: 'single',
			showModal: false,
			firstTwoItems: stairTypes.slice(0, 2),
			leftItems: stairTypes.slice(2, 5)
		};
	},
	methods: {
		handleMouseOver(hovered) {
			this.hoveredLink = hovered;
		}
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
	margin: 0 auto;
	position: absolute;
	top: 40%;
	left: 50%;
	transform: translate(-50%, -40%);
	z-index: 1;
	ul{
		list-style-type: none;
		display: flex;
		justify-content: center;
		padding-left: 0;
		margin-bottom: 0;
		li{
			&:nth-child(1){
				margin-right: 20px;
			}
			&:nth-child(2){
				margin-left: 20px;
			}
			.link-desc{
				color: white;
				transition: all 0.2s ease-in-out;
			}
			&:hover{
				.link-desc{
					color: #31B404;
					font-weight: bold;
				}	
			}
			img{
				display: block;
				margin-bottom: 16px;
			}
		}
	}
}
.slider{
	width: 100%;
	margin-top: 10px;
	.indicator {
      	height: 4px;
		width: 100px;
		background: #2a8641;
		border-radius: 1px;
		transition: all 0.3s ease-in-out;
    }
	&.single{
		.indicator{
			transform: translateX(50%);
		}
	}
	&.dual{
		.indicator{
			transform: translateX(290%);
		}
	}
}
</style>
