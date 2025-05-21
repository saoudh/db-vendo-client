import {stringify} from 'qs';

const formatStationBoardReq = (ctx, station, type) => {
	const {profile, opt} = ctx;

	if (opt.departure || opt.arrival) {
		throw new Error('opt.departure/opt.arrival is not supported for profile dbbahnhof, can only query for current time.');
	}
	const evaNumbers = [station];
	if (opt.moreStops) {
		evaNumbers.push(...opt.moreStops);
	}
	const query = {
		filterTransports: profile.formatProductsFilter(ctx, opt.products || {}, 'ris_alt'),
		evaNumbers: evaNumbers,
		duration: opt.duration,
		sortBy: 'TIME_SCHEDULE',
		locale: opt.language,
	};

	return {
		endpoint: profile.boardEndpoint,
		path: type + '?' + stringify(query, {arrayFormat: 'repeat', encodeValuesOnly: true}),
		method: 'get',
	};
};

export {
	formatStationBoardReq,
};
