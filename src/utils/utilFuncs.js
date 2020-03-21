export const do_Times = n => f => {
	let iter = i => {
		if (i === n) return;
		f(i);
		iter(i + 1);
	};
	return iter(0);
};

/**
 * @param {Array} items
 * @param {Array} itemWeights
 * @return {item of Array} 依據各別權重，隨機選出陣列中的物件
 */
export function weightedRandom(items, itemWeights) {
	const totalWeight = itemWeights.reduce((acc, currVal) => acc + currVal, 0);
	const randomArray = [];

	for (let i = 0; i < items.length; i++) {
		for (let j = 0; j < itemWeights[i]; j++) {
			randomArray.push(i);
		}
	}

	const randomNumber = Math.floor(Math.random() * totalWeight);
	return items[randomArray[randomNumber]];
}

export function playSound(elementId, vol = 1) {
	const sound = document.getElementById(elementId);
	sound.currentTime = 0;
	sound.volume = vol;
	sound.play();
}

export function stopSound(elementId) {
	const sound = document.getElementById(elementId);
	sound.currentTime = 0;
	sound.pause();
}

export function playSound_Times(elementId, times) {
	const loop = setInterval(repeat, 500);

	function repeat() {
		times--;
		if (times === 0) {
			clearInterval(loop);
		}

		const sound = document.getElementById(elementId);
		sound.currentTime = 0;
		sound.play();
	}

	repeat();
}

export function debounce(func, wait) {
	// 定時器變數
	let timeout;
	return function(evt) {
		// 每次觸發 scroll handler 時先清除定時器
		clearTimeout(timeout);
		// 指定 xx ms 後觸發真正想進行的操作 handler
		timeout = setTimeout(() => func(evt), wait);
	};
}
