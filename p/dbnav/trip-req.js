import {getHeaders} from './header.js';

const formatTripReq = ({profile, opt}, id) => {
	return {
		endpoint: profile.tripEndpoint,
		path: encodeURIComponent(id),
		headers: getHeaders('application/x.db.vendo.mob.zuglauf.v2+json'),
		method: 'get',
	};
};

export {
	formatTripReq,
};
