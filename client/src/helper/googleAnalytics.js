function InitializeReactGA(ReactGA) {
	if (!window.GA_INITIALIZED) {
		ReactGA.initialize("UA-193108900-2");
		window.GA_INITIALIZED = true;
	}
}

export default InitializeReactGA; 