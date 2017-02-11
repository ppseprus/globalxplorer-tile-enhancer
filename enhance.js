const enabledUrlPartial = 'globalxplorer.org/explore';
const maximumBrightness = 30;
const maximumContrast = 15;
const defaultBarWidth = 50;
const defaultBarHeight = 18;

let horizontalLegend,
	verticalLegend;

const asPercentage = number => {
	return (number * 100).toFixed(1) + '%';
};

const injectLegends = () => {
	if (document.getElementsByClassName('tile-enhancement-legend').length === 2) {
		return;
	}

	horizontalLegend = document.createElement('div');
	horizontalLegend.className = 'tile-enhancement-legend';
	horizontalLegend.id = 'horizontal-legend';
	document.body.appendChild(horizontalLegend);

	verticalLegend = document.createElement('div');
	verticalLegend.className = 'tile-enhancement-legend';
	verticalLegend.id = 'vertical-legend';
	document.body.appendChild(verticalLegend);
};

const hideLegends = () => {
	horizontalLegend.setAttribute('style', 'display: none;');
	verticalLegend.setAttribute('style', 'display: none;');
};

const positionLegends = legends => {
	horizontalLegend.setAttribute('style', `top: ${legends.horizontal.top}px; left: ${legends.horizontal.left - defaultBarWidth / 2}px;`);
	horizontalLegend.textContent = asPercentage(legends.horizontal.value);
	verticalLegend.setAttribute('style', `top: ${legends.vertical.top - defaultBarHeight / 2}px; left: ${legends.vertical.left}px;`);
	verticalLegend.textContent = asPercentage(legends.vertical.value);
};

const getSumOfAttributes = attributes => {
	return attributes.reduce((sum, attribute) => {
		return sum += parseFloat(attribute);
	}, 0);
};

const getDimensions = className => {
	let element = document.getElementsByClassName(className)[0],
		style = getComputedStyle(element);

	let offsetTop = element.getBoundingClientRect().top,
		offsetLeft = element.getBoundingClientRect().left;

	let innerWidth = getSumOfAttributes([style.width, style.paddingLeft, style.paddingRight]),
		innerHeight = getSumOfAttributes([style.height, style.paddingTop, style.paddingBottom]);

	let outerWidth = innerWidth + getSumOfAttributes([style.marginLeft, style.marginRight, style.borderWidth]),
		outerHeight = innerHeight + getSumOfAttributes([style.marginTop, style.marginBottom, style.borderWidth]);

	let midX = offsetLeft + outerWidth / 2,
		midY = offsetTop + outerHeight / 2;

	return {
		offsetTop: offsetTop,
		offsetLeft: offsetLeft,
		innerWidth: innerWidth,
		innerHeight: innerHeight,
		outerWidth: outerWidth,
		outerHeight: outerHeight,
		midX: midX,
		midY: midY
	};
};

const scale = (value, range, boundary) => {
	return 1 + value / (range / boundary) / 100;
};

const setFitlers = (brightness, contrast) => {
	document
		.getElementsByClassName('tile')[0]
		.setAttribute('style', `filter: brightness(${brightness}) contrast(${contrast});`);
};

const enhancementHandler = event => {
	if (document.getElementsByClassName('tile').length !== 1) {
		return;
	}

	injectLegends();

	let loader = getDimensions('tile-loader'),
		polygon = getDimensions('tile-polygon'),
		rangeX = polygon.innerWidth / 2,
		rangeY = polygon.innerHeight / 2,
		dx = event.clientX - loader.midX,
		dy = event.clientY - loader.midY;

	if (Math.abs(dx) <= rangeX && Math.abs(dy) <= rangeY) {
		let brightness = scale(dx, rangeX, maximumBrightness),
			contrast = scale(-dy, rangeY, maximumContrast);

		let legends = {
			horizontal: {
				top: loader.midY + rangeY,
				left: loader.midX + dx,
				value: brightness
			},
			vertical: {
				top: loader.midY + dy,
				left: loader.midX + rangeX,
				value: contrast
			}
		};

		setFitlers(brightness, contrast);
		positionLegends(legends);
	} else {

		setFitlers(1, 1);
		hideLegends();
	}
};

const isUrlEnabled = () => {
	return document.location.href.indexOf(enabledUrlPartial) > -1;
};

const toggle = () => {
	document.onmousemove = isUrlEnabled() ? enhancementHandler : null;
};

chrome
	.runtime
	.onMessage
	.addListener(message => {
		if (message.sync === 'enhancejs') {
			toggle();
		}
	});

toggle();
