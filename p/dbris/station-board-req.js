const formatStationBoardReq = (ctx, station, type) => {
	const {profile, opt} = ctx;

	const query = {
		filterTransports: profile.formatProductsFilter(ctx, opt.products || {}, 'ris_alt'),
		timeStart: profile.formatTime(profile, opt.when, true),
		timeEnd: profile.formatTime(profile, opt.when.getTime() + opt.duration * 60 * 1000, true),
		includeStationGroup: opt.includeRelatedStations,
		maxTransportsPerType: opt.results === Infinity ? undefined : opt.results,
		includeMessagesDisruptions: opt.remarks,
		sortBy: 'TIME_SCHEDULE',
	};
	if (!opt.stopovers) {
		query.maxViaStops = 0;
	}
	if (opt.moreStops) {
		station += ',' + opt.moreStops.join(',');
	}
	return {
		endpoint: profile.boardEndpoint,
		path: type + '/' + station,
		query: query,
		method: 'get',
		headers: {
			'Db-Client-Id': process.env.DB_CLIENT_ID,
			'Db-Api-Key': process.env.DB_API_KEY,
			'Accept': 'application/vnd.de.db.ris+json',
		},
	};
};

export {
	formatStationBoardReq,
};
