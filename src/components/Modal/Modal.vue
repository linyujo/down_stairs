<template>
	<div className="modal">
		<div class="modal-mask">
			<div class="modal-wrapper">
				<div class="modal-container">
					<button class="closeCross btn" @click="$emit('close')">
						<span></span>
						<span></span>
					</button>
					<div class="modal-header">
						<slot name="customHeader">
							default header
						</slot>
					</div>
					<div class="modal-body">
						<slot name="customBody">
							default body
						</slot>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "Modal"
};
</script>

<style lang="scss" scoped>
.modal-mask {
	position: fixed;
	z-index: 9998;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0.2);
	transition: opacity 0.3s ease;
	display: flex;
	justify-content: center;
	align-items: center;
}
.modal-container {
	background-color: #fefefe;
	width: 100%;
	// max-width: 624px;
	min-height: 96px;
	border-radius: 4px;
	margin: 0 auto;
	position: relative;
}
.modal-header {
	border-bottom: 1px solid rgba(34, 36, 38, 0.15);
	padding: 1rem 1rem;
	font-weight: bold;
}
.modal-body {
	padding: 30px;
}

.btn {
	/* Remove First 移除ios input style */
	appearance: none;
	position: relative;
	box-sizing: border-box;
	display: inline-block;
	margin: 0;
	border: 0;
	outline: 0;
	text-decoration: none;
	letter-spacing: 0;
	/* 使用者互動 */
	cursor: pointer;
	user-select: none;
	background: transparent;
}

.closeCross {
	width: 55px;
	height: 55px;
	position: absolute;
	right: 0;
	transition: all 0.3s;
	&:hover {
		transform: rotate(180deg);
	}
}

.closeCross span {
	width: 16px;
	height: 2px;
	background-color: #484848;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	&:first-child {
		transform: translate(-50%, -50%) rotate(45deg);
	}
	&:last-child {
		transform: translate(-50%, -50%) rotate(-45deg);
	}
}
</style>
