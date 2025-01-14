import {formatTripReq as hafasFormatTripReq} from '../../format/trip-req.js';


const formatTripReq = ({profile, opt}, id) => {
	if (id.includes('#')) {
		return hafasFormatTripReq({profile, opt}, id);
	}
	return {
		endpoint: profile.regioGuideTripEndpoint,
		path: id,
		method: 'get',
	};
};

export {
	formatTripReq,
};
