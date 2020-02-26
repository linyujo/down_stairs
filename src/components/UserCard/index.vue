<template>
	<li class="user-card">
		<div class="avatar">
			<div class="imageBox">
				<div class="imageBox__ratio">
					<div class="image" :style="{background: `url(${user.avatar}) `}" />
				</div>
			</div>
		</div>
		<div class="userName">{{user.username}}</div>
	</li>
</template>

<script>
export default {
	props: ["user"]
};
</script>

<style lang="scss" scoped>
$background-types: (
	1: #ab3df6,
	2: #f92673,
	3: #d02d45,
	4: #48d555,
	5: #5bc7f9,
	6: #2671cd
);

@mixin background {
	@for $i from 1 through 7 {
		&:nth-child(#{$i}) {
			background: linear-gradient(
				90deg,
				map-get($background-types, $i) 0%,
				#ffffff 18%,
				#ffffff 100%
			);
		}
	}
}

li {
	display: inline-block;
	list-style: none;
}

.user-card {
	display: flex;
	align-items: center;
	padding: 0 16px;
	margin-bottom: 8px;
	@include background;
	cursor: pointer;
	box-shadow: 5px 5px 5px -5px #333;
	transition: 0.3s;
	// &:hover {
	// 	box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
	// }
}
.avatar {
	width: 70px;
}
.imageBox {
	width: 100%;
	overflow: hidden;
	border-radius: 50%;
	.image {
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
}
.imageBox .imageBox__ratio {
	width: 100%;
	padding-top: 100%;
	position: relative;
}
.userName {
	line-height: 70px;
	margin-left: 16px;
	font-size: 1.2rem;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	width: 100%;
	text-align: left;
}
</style>