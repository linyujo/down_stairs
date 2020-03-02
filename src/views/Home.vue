<template>
	<div class="home-view">
		<div class="home-bg"></div>
		<nav id="nav">
			<router-link to="/">單機</router-link>
			<router-link to="/dual">連線</router-link>
		</nav>
		<Playground />
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
// @ is an alias to /src
import Playground from "@/components/DownStairs/CanvasPlayground.vue";
import Modal from "@/components/Modal/Modal.vue";

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
		Playground,
		Modal
	},
	data() {
		return {
			showModal: false,
			firstTwoItems: stairTypes.slice(0, 2),
			leftItems: stairTypes.slice(2, 5)
		};
	}
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
	background: linear-gradient(
		90deg,
		rgba(0, 0, 0, 1) 0%,
		rgba(83, 83, 83, 1) 80%,
		rgba(171, 171, 171, 1) 100%
	);
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
#nav {
	top: 30px;
	z-index: 1;
	cursor: pointer;
	a {
		font-weight: bold;
		text-decoration: none;
		color: white;
		&:first-child {
			&::after {
				content: "";
				display: inline-block;
				background: white;
				width: 2px;
				height: 16px;
				margin-left: 10px;
				margin-right: 10px;
				vertical-align: middle;
			}
		}
		&.router-link-exact-active {
			color: #4aff4a;
			text-decoration: underline;
		}
	}
}
</style>
