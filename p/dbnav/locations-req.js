import {getHeaders} from './header.js';

const formatLocationsReq = (ctx, query) => {
	const {profile, opt} = ctx;

	return {
		endpoint: profile.locationsEndpoint,
		body: {
			locationTypes: profile.formatLocationFilter(opt.stops, opt.addresses, opt.poi),
			searchTerm: query,
			maxResults: opt.results,
		},
		headers: getHeaders('application/x.db.vendo.mob.location.v3+json'),
		method: 'post',
	};
};

export {
	formatLocationsReq,
};
