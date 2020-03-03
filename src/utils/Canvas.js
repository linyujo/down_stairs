// 此函式僅用於生產Canvas，因此建立一個工廠函式
export function Canvas(width, height) {
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	return [canvas, canvas.getContext("2d")];
}
