export default class Vector2D {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	get length() {
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	}
	get angle() {
		return Math.atan2(this.y, this.x);
	}
	get unit() {
		return this.times(1 / this.length);
	}
	set(x, y) {
		this.x = x;
		this.y = y;
	}
	set length(nv) {
		const tempV = this.unit.times(nv);
		this.set(tempV.x, tempV.y);
	}
	move(v) {
		return new Vector2D(this.x + v.x, this.y + v.y);
	}
	add(v) {
		return new Vector2D(this.x + v.x, this.y + v.y);
	}
	sub(v) {
		return new Vector2D(this.x - v.x, this.y - v.y);
	}
	times(s) {
		return new Vector2D(this.x * s, this.y * s);
	}
	clone() {
		return new Vector2D(this.x, this.y);
	}
	toString() {
		return `(${this.x},${this.y})`;
	}
	isEqual(v) {
		return this.x === v.x && this.y === v.y;
	}
}

export function getDistance(p1, p2) {
	return p1.sub(p2).length;
}
