import {createRequire} from 'module';
const require = createRequire(import.meta.url);

const baseProfile = require('./base.json');
import {products} from '../../lib/products.js';
// import {formatJourneysReq, formatRefreshJourneyReq} from './journeys-req.js';
import {formatLocationFilter} from './location-filter.js';
import {formatLocationsReq} from './locations-req.js';
import {formatNearbyReq} from './nearby-req.js';
import {formatStationBoardReq} from './station-board-req.js';
// import {formatTravellers} from './travellers.js';
// import {parseTickets, parsePrice} from './tickets.js';

const profile = {
	...baseProfile,
	locale: 'de-DE',
	timezone: 'Europe/Berlin',

	products,
	// formatJourneysReq,
	// formatRefreshJourneyReq,
	formatNearbyReq,
	formatLocationsReq,
	formatStationBoardReq,
	formatLocationFilter,
	// parsePrice,
	// parseTickets,
	// formatTravellers,
};

export {
	profile,
};
