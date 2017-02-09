chrome
	.webNavigation
	.onHistoryStateUpdated
	.addListener(details => {
		chrome
			.tabs
			.sendMessage(details.tabId, { sync: 'enhancejs' });
	});
