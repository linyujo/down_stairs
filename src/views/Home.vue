<template>
	<div class="home">
		<!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
		<!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
		<Playground />
		<Modal v-if="showModal" @close="showModal = false">
			<div slot="customHeader">階梯說明</div>
			<div slot="customBody">
				<div class="container">
					<div class="row">
						<li v-for="(stair, index) in firstTwoItems" v-bind:key="index">
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
						<li v-for="(stair, index) in leftItems" v-bind:key="index">
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
import Playground from "@/components/DownStairs/CanvasPlayground.vue";
import Modal from "@/components/Modal/Modal.vue";
import wsClient from "@/sockets/index";

const stairTypes = [
	{
		src: "background: url(https://imgur.com/O3r8eqB.png})",
		type: "尖刺階梯",
		descript: "傷害，血量 - 1"
	},
	{
		src: `background: url(https://imgur.com/D3edaEP.png)`,
		type: "彈跳階梯",
		descript: "向上彈跳"
	},
	{
		src: `background: url(https://imgur.com/EFbSNit.png)`,
		type: "彈跳階梯",
		descript: "補血，血量 + 1"
	},
	{
		src: `background: url(https://imgur.com/BCszJnB.png)`,
		type: "滑動階梯",
		descript: "輸送帶，向左/向右滑動"
	},
	{
		src: `background: url(https://imgur.com/2vCGpRh.png)`,
		type: "流沙階梯",
		descript: "會緩慢穿過掉下"
	}
];

export default {
	components: {
		Playground,
		Modal
	},
	data() {
		return {
			showModal: true,
			firstTwoItems: stairTypes.slice(0, 2),
			leftItems: stairTypes.slice(2, 5)
		};
	},
	created() {
		this.initWebSocket();
	},
	methods: {
		initWebSocket() {
			// wsClient
		}
	}
};
</script>

<style lang="scss" scoped>
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

li {
	display: inline-block;
	list-style: none;
	.title {
		margin: 8px 0 4px 0;
		font-weight: bold;
	}
}
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
</style>
