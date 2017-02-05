const maximumBrightness = 30;
const maximumContrast = 15;

const setFitlers = (brightness, contrast) => {
	document.getElementsByClassName('tile')[0]
		.setAttribute('style', `filter: brightness(${brightness}) contrast(${contrast});`);
};

document.onmousemove = e => {
	if (document.getElementsByClassName('tile').length !== 1) {
		return;
	}

	let satellite = document.getElementsByClassName('tile-loader')[0],
		tileSize = parseFloat(getComputedStyle(satellite).width) / 2,
		range = tileSize / 2,
		tileMidX = satellite.getBoundingClientRect().left + tileSize,
		tileMidY = satellite.getBoundingClientRect().top + tileSize,
		dx = e.clientX - tileMidX,
		dy = e.clientY - tileMidY;

	const scale = (value, boundary) => {
		return 1 + (value / (range / boundary)) / 100;
	};

	if (Math.abs(dx) <= range && Math.abs(dy) <= range) {
		let brightness = scale(dx, maximumBrightness),
			contrast = scale(-dy, maximumContrast);

		setFitlers(brightness, contrast);
	} else {

		setFitlers(1, 1);
	}
};
