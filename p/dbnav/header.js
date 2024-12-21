const getHeaders = (contentType) => {
	return {
		'X-Correlation-ID': 'null',
		'Accept': contentType,
		'Content-Type': contentType,
	};
};

export {
	getHeaders,
};
