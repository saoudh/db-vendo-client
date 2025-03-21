const formatStationBoardReq = (ctx, station, type) => {
	const {profile, opt} = ctx;

	if (opt.moreStops) {
		station += ',' + opt.moreStops.join(',');
	}

	return {
		endpoint: profile.boardEndpoint,
		path: (type == 'departures' ? 'departure' : 'arrival') + '/' + station,
		query: {
			// TODO direction, fields below
			modeOfTransport: profile.formatProductsFilter(ctx, opt.products || {}, 'ris'),
			timeStart: profile.formatTime(profile, opt.when, true),
			timeEnd: profile.formatTime(profile, opt.when.getTime() + opt.duration * 60 * 1000, true),
			expandTimeFrame: 'TIME_END', // TODO impact?
		},
		method: 'get',
	};
};

export {
	formatStationBoardReq,
};
