const formatTripReq = ({profile, opt}, id) => {
	return {
		endpoint: profile.tripEndpoint,
		path: '',
		query: {
			journeyId: id,
			poly: opt.polyline || opt.polylines,
		},
		method: 'get',
	};
};

export {
	formatTripReq,
};
