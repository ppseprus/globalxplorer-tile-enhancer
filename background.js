chrome
	.webNavigation
	.onHistoryStateUpdated
	.addListener(stateDetails => {
		chrome
			.tabs
			.sendMessage(stateDetails.tabId, { sync: 'enhancejs' });
	});
