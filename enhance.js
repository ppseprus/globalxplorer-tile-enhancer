const maximumBrightness = 30;
const maximumContrast = 15;

const enabledUrlPartial = 'globalxplorer.org/explore';

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

	let loader = getDimensions('tile-loader'),
		polygon = getDimensions('tile-polygon'),
		rangeX = polygon.innerWidth / 2,
		rangeY = polygon.innerHeight / 2,
		dx = event.clientX - loader.midX,
		dy = event.clientY - loader.midY;

	if (Math.abs(dx) <= rangeX && Math.abs(dy) <= rangeY) {
		let brightness = scale(dx, rangeX, maximumBrightness),
			contrast = scale(-dy, rangeY, maximumContrast);

		setFitlers(brightness, contrast);
	} else {

		setFitlers(1, 1);
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
