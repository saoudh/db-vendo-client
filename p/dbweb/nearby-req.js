const formatNearbyReq = (ctx, location) => {
	const {profile, opt} = ctx;

	return {
		endpoint: profile.nearbyEndpoint,
		query: {
			long: location.longitude,
			lat: location.latitude,
			radius: opt.distance || undefined,
			products: profile.formatProductsFilter(ctx, opt.products || {}),
			// TODO getPOIs: Boolean(opt.poi),
			// TODO getStops: Boolean(opt.stops),
			maxNo: opt.results,
		},
		method: 'get',
	};
};

export {
	formatNearbyReq,
};
