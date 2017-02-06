const maximumBrightness = 30;
const maximumContrast = 15;

const getDimensions = (style, withMargin = true) => {
	let width = parseFloat(style.width)
			+ parseFloat(style.paddingLeft)
			+ parseFloat(style.paddingRight),
		height = parseFloat(style.height)
			+ parseFloat(style.paddingTop)
			+ parseFloat(style.paddingBottom);

	width += withMargin ? parseFloat(style.marginLeft) + parseFloat(style.marginRight) + parseFloat(style.borderWidth) : 0;

	height += + withMargin ? parseFloat(style.marginTop) + parseFloat(style.marginBottom) + parseFloat(style.borderWidth) : 0;

	return [width, height];
};

const setFitlers = (brightness, contrast) => {
	document.getElementsByClassName('tile')[0]
		.setAttribute('style', `filter: brightness(${brightness}) contrast(${contrast});`);
};

document.onmousemove = e => {
	if (document.getElementsByClassName('tile').length !== 1) {
		return;
	}

	let loader = document.getElementsByClassName('tile-loader')[0],
		polygon = document.getElementsByClassName('tile-polygon')[0],
		[loaderWidth, loaderHeight] = getDimensions(getComputedStyle(polygon)),
		[tileWidth, tileHeight] = getDimensions(getComputedStyle(polygon), false),
		rangeX = tileWidth / 2,
		rangeY = tileHeight / 2,
		tileMidX = loader.getBoundingClientRect().left + loaderWidth / 2,
		tileMidY = loader.getBoundingClientRect().top + loaderHeight / 2,
		dx = e.clientX - tileMidX,
		dy = e.clientY - tileMidY;

	const scale = (value, boundary) => {
		return 1 + (value / ((rangeX + rangeY) / 2 / boundary)) / 100;
	};

	if (Math.abs(dx) <= rangeX && Math.abs(dy) <= rangeY) {
		let brightness = scale(dx, maximumBrightness),
			contrast = scale(-dy, maximumContrast);

		setFitlers(brightness, contrast);
	} else {

		setFitlers(1, 1);
	}
};
