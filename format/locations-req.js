const formatLocationsReq = (ctx, query) => {
	const {profile, opt} = ctx;

	return {		
		typ: profile.formatLocationFilter(opt.stops, opt.addresses, opt.poi),
		suchbegriff: query,			
		limit: opt.results,
	};
};

export {
	formatLocationsReq,
};
