// todo: use import assertions once they're supported by Node.js & ESLint
// https://github.com/tc39/proposal-import-assertions
import {createRequire} from 'module';
const require = createRequire(import.meta.url);

import uniqBy from 'lodash/uniqBy.js';
import slugg from 'slugg';
import without from 'lodash/without.js';
import {parseHook} from '../../lib/profile-hooks.js';

import {parseJourney as _parseJourney} from '../../parse/journey.js';
import {parseJourneyLeg as _parseJourneyLeg} from '../../parse/journey-leg.js';
import {parseLine as _parseLine} from '../../parse/line.js';
import {parseArrival as _parseArrival} from '../../parse/arrival.js';
import {parseDeparture as _parseDeparture} from '../../parse/departure.js';
import {parseLocation as _parseLocation} from '../../parse/location.js';
import {formatStation as _formatStation} from '../../format/station.js';
import {parseDateTime} from '../../parse/date-time.js';

const baseProfile = require('./base.json');
import {products} from './products.js';
import {formatLoyaltyCard} from './loyalty-cards.js';
import {ageGroup, ageGroupFromAge, ageGroupLabel} from './ageGroup.js';

const transformReqBody = (ctx, body) => {
	return body;
};

const slices = (n, arr) => {
	const initialState = {slices: [], count: Infinity};
	return arr.reduce(({slices, count}, item) => {
		if (count >= n) {
			slices.push([item]);
			count = 1;
		} else {
			slices[slices.length - 1].push(item);
			count++;
		}
		return {slices, count};
	}, initialState).slices;
};

const parseGrid = (g) => {
	// todo: g.type, e.g. `S`
	// todo: respect `g.itemL[].(col|row)`?

	// todo
	// parseGrid is being called by parseLocWithDetails, which is being called as
	// profile.parseLocation by profile.parseCommon, parseCommon hasn't finished
	// resolving all references yet, so we have to resolve them manually here.
	// This would be fixed if we resolve references on-the-fly or in a recursive/
	// iterative process.
	return {
		title: g.title,
		rows: slices(g.nCols, g.itemL.map(item => Array.isArray(item.hints) && item.hints[0]
		|| Array.isArray(item.remarkRefs) && item.remarkRefs[0] && item.remarkRefs[0].hint
		|| {},
		)),
	};
};

const ausstattungKeys = Object.assign(Object.create(null), {
	'3-s-zentrale': '3SZentrale',
	'parkplatze': 'parkingLots',
	'fahrrad-stellplatze': 'bicycleParkingRacks',
	'opnv-anbindung': 'localPublicTransport',
	'wc': 'toilets',
	'schliessfacher': 'lockers',
	'reisebedarf': 'travelShop',
	'stufenfreier-zugang': 'stepFreeAccess',
	'ein-umsteigehilfe': 'boardingAid',
	'taxi-am-bahnhof': 'taxis',
});
const parseAusstattungVal = (val) => {
	val = val.toLowerCase();
	return val === 'ja'
		? true
		: val === 'nein'
			? false
			: val;
};

const parseAusstattungGrid = (g) => {
	// filter duplicate hint rows
	const rows = uniqBy(g.rows, ([key, val]) => key + ':' + val);

	const res = {};
	Object.defineProperty(res, 'raw', {value: rows});
	for (let [key, val] of rows) {
		key = ausstattungKeys[slugg(key)];
		if (key) {
			res[key] = parseAusstattungVal(val);
		}
	}
	return res;
};

const parseReisezentrumÖffnungszeiten = (g) => {
	const res = {};
	for (const [dayOfWeek, val] of g.rows) {
		res[dayOfWeek] = val;
	}
	res.raw = g.rows;
	return res;
};

const parseLocWithDetails = ({parsed, common}, l) => {
	if (!parsed) {
		return parsed;
	}
	if (parsed.type !== 'stop' && parsed.type !== 'station') {
		return parsed;
	}

	if (Array.isArray(l.gridL)) {
		const resolveCells = grid => ({
			...grid,
			rows: grid.rows.map(row => row.map(cell => cell && cell.text)),
		});

		let grids = l.gridL
			.map(grid => parseGrid(grid, common))
			.map(resolveCells);

		const ausstattung = grids.find(g => slugg(g.title) === 'ausstattung');
		if (ausstattung) {
			parsed.facilities = parseAusstattungGrid(ausstattung);
		}
		const öffnungszeiten = grids.find(g => slugg(g.title) === 'offnungszeiten-reisezentrum');
		if (öffnungszeiten) {
			parsed.reisezentrumOpeningHours = parseReisezentrumÖffnungszeiten(öffnungszeiten);
		}

		grids = without(grids, ausstattung, öffnungszeiten);
		if (grids.length > 0) {
			parsed.grids = grids;
		}
	}

	return parsed;
};

// https://www.bahn.de/p/view/service/buchung/auslastungsinformation.shtml
const loadFactors = [];
loadFactors[1] = 'low-to-medium';
loadFactors[2] = 'high';
loadFactors[3] = 'very-high';
loadFactors[4] = 'exceptionally-high';

const parseLoadFactor = (opt, auslastung) => {
	if (!auslastung) {
		return null;
	}
	const cls = opt.firstClass
		? 'KLASSE_1'
		: 'KLASSE_2';
	const load = auslastung.find(a => a.klasse === cls)?.stufe;
	return load && loadFactors[load.r] || null;
};

const parseArrOrDepWithLoadFactor = ({parsed, res, opt}, d) => {

	/* const load = parseLoadFactor(opt, d);
	if (load) {
		parsed.loadFactor = load;
	}*/ // TODO
	return parsed;
};

const trfReq = (opt, refreshJourney) => {
	if ('age' in opt && 'ageGroup' in opt) {
		throw new TypeError(`\
opt.age and opt.ageGroup are mutually exclusive.
Pass in just opt.age, and the age group will calculated automatically.`);
	}

	const tvlrAgeGroup = 'age' in opt
		? ageGroupFromAge(opt.age)
		: opt.ageGroup;

	const basicCtrfReq = {
		klasse: opt.firstClass === true ? 'KLASSE_1' : 'KLASSE_2',
		// todo [breaking]: support multiple travelers
		reisende: [{
			typ: ageGroupLabel[tvlrAgeGroup || ageGroup.ADULT],
			anzahl: 1,
			alter: 'age' in opt
				? [String(opt.age)]
				: [],
			ermaessigungen: [formatLoyaltyCard(opt.loyaltyCard)],
		}],
	};
	return basicCtrfReq;
};

const transformJourneysQuery = ({profile, opt}, query) => {
	query = Object.assign(query, trfReq(opt, false));
	return {
		endpoint: profile.journeysEndpoint,
		body: query,
		method: 'post',
	};
};

const formatRefreshJourneyReq = (ctx, refreshToken) => {
	const {profile, opt} = ctx;
	const req = {
		getIST: true,
		getPasslist: Boolean(opt.stopovers),
		getPolyline: Boolean(opt.polylines),
		getTariff: Boolean(opt.tickets),
	};
	if (profile.refreshJourneyUseOutReconL) {
		req.outReconL = [{ctx: refreshToken}];
	} else {
		req.ctxRecon = refreshToken;
	}
	req.trfReq = trfReq(opt, true);

	return {
		meth: 'Reconstruction',
		req,
	};
};

// todo: fix this
// line: {
// 	type: 'line',
// 	id: '5-vbbbvb-x9',
// 	fahrtNr: '52496',
// 	name: 'X9',
// 	public: true,
// 	mode: 'bus',
// 	product: 'bus',
// 	operator: {type: 'operator', id: 'nahreisezug', name: 'Nahreisezug'}
// }
const parseLineWithAdditionalName = ({parsed}, l) => {
	if (l.nameS && ['bus', 'tram', 'ferry'].includes(l.product)) {
		parsed.name = l.nameS;
	}
	if (l.addName) {
		parsed.additionalName = parsed.name;
		parsed.name = l.addName;
	}
	return parsed;
};

// todo: sotRating, conSubscr, isSotCon, showARSLink, sotCtxt
// todo: conSubscr, showARSLink, useableTime
const mutateToAddPrice = (parsed, raw) => {
	parsed.price = null;
	// TODO find all prices?
	if (raw.angebotsPreis?.betrag) {
		parsed.price = {
			amount: raw.angebotsPreis.betrag,
			currency: raw.angebotsPreis.waehrung,
			hint: null,
		};
	}
	return parsed;
};

const parseJourneyWithPriceAndTickets = ({parsed, opt}, raw) => {
	mutateToAddPrice(parsed, raw);
	// mutateToAddTickets(parsed, opt, raw); TODO
	return parsed;
};

const parseJourneyLegWithLoadFactor = ({parsed, res, opt}, raw) => {
	const load = parseLoadFactor(opt, raw.auslastungsmeldungen);
	if (load) {
		parsed.loadFactor = load;
	}
	return parsed;
};

// todo:
// [ { type: 'hint',
//     code: 'P5',
//     text: 'Es gilt ein besonderer Fahrpreis' }
const hintsByCode = Object.assign(Object.create(null), {
	fb: {
		type: 'hint',
		code: 'bicycle-conveyance',
		summary: 'bicycles conveyed',
	},
	fr: {
		type: 'hint',
		code: 'bicycle-conveyance-reservation',
		summary: 'bicycles conveyed, subject to reservation',
	},
	nf: {
		type: 'hint',
		code: 'no-bicycle-conveyance',
		summary: 'bicycles not conveyed',
	},
	k2: {
		type: 'hint',
		code: '2nd-class-only',
		summary: '2. class only',
	},
	eh: {
		type: 'hint',
		code: 'boarding-ramp',
		summary: 'vehicle-mounted boarding ramp available',
	},
	ro: {
		type: 'hint',
		code: 'wheelchairs-space',
		summary: 'space for wheelchairs',
	},
	oa: {
		type: 'hint',
		code: 'wheelchairs-space-reservation',
		summary: 'space for wheelchairs, subject to reservation',
	},
	wv: {
		type: 'hint',
		code: 'wifi',
		summary: 'WiFi available',
	},
	wi: {
		type: 'hint',
		code: 'wifi',
		summary: 'WiFi available',
	},
	sn: {
		type: 'hint',
		code: 'snacks',
		summary: 'snacks available for purchase',
	},
	mb: {
		type: 'hint',
		code: 'snacks',
		summary: 'snacks available for purchase',
	},
	mp: {
		type: 'hint',
		code: 'snacks',
		summary: 'snacks available for purchase at the seat',
	},
	bf: {
		type: 'hint',
		code: 'barrier-free',
		summary: 'barrier-free',
	},
	rg: {
		type: 'hint',
		code: 'barrier-free-vehicle',
		summary: 'barrier-free vehicle',
	},
	bt: {
		type: 'hint',
		code: 'on-board-bistro',
		summary: 'Bordbistro available',
	},
	br: {
		type: 'hint',
		code: 'on-board-restaurant',
		summary: 'Bordrestaurant available',
	},
	ki: {
		type: 'hint',
		code: 'childrens-area',
		summary: 'children\'s area available',
	},
	kk: {
		type: 'hint',
		code: 'parents-childrens-compartment',
		summary: 'parent-and-children compartment available',
	},
	kr: {
		type: 'hint',
		code: 'kids-service',
		summary: 'DB Kids Service available',
	},
	ls: {
		type: 'hint',
		code: 'power-sockets',
		summary: 'power sockets available',
	},
	ev: {
		type: 'hint',
		code: 'replacement-service',
		summary: 'replacement service',
	},
	kl: {
		type: 'hint',
		code: 'air-conditioned',
		summary: 'air-conditioned vehicle',
	},
	r0: {
		type: 'hint',
		code: 'upward-escalator',
		summary: 'upward escalator',
	},
	au: {
		type: 'hint',
		code: 'elevator',
		summary: 'elevator available',
	},
	ck: {
		type: 'hint',
		code: 'komfort-checkin',
		summary: 'Komfort-Checkin available',
	},
	it: {
		type: 'hint',
		code: 'ice-sprinter',
		summary: 'ICE Sprinter service',
	},
	rp: {
		type: 'hint',
		code: 'compulsory-reservation',
		summary: 'compulsory seat reservation',
	},
	rm: {
		type: 'hint',
		code: 'optional-reservation',
		summary: 'optional seat reservation',
	},
	scl: {
		type: 'hint',
		code: 'all-2nd-class-seats-reserved',
		summary: 'all 2nd class seats reserved',
	},
	acl: {
		type: 'hint',
		code: 'all-seats-reserved',
		summary: 'all seats reserved',
	},
	sk: {
		type: 'hint',
		code: 'oversize-luggage-forbidden',
		summary: 'oversize luggage not allowed',
	},
	hu: {
		type: 'hint',
		code: 'animals-forbidden',
		summary: 'animals not allowed, except guide dogs',
	},
	ik: {
		type: 'hint',
		code: 'baby-cot-required',
		summary: 'baby cot/child seat required',
	},
	ee: {
		type: 'hint',
		code: 'on-board-entertainment',
		summary: 'on-board entertainment available',
	},
	toilet: {
		type: 'hint',
		code: 'toilet',
		summary: 'toilet available',
	},
	oc: {
		type: 'hint',
		code: 'wheelchair-accessible-toilet',
		summary: 'wheelchair-accessible toilet available',
	},
	iz: {
		type: 'hint',
		code: 'intercity-2',
		summary: 'Intercity 2',
	},
});

const parseHintByCode = (raw) => {
	const hint = hintsByCode[raw.key.trim()
		.toLowerCase()];
	if (hint) {
		return Object.assign({text: raw.value}, hint);
	}
	return null;
};

const isIBNR = /^\d{6,}$/;
const formatStation = (id) => {
	if (!isIBNR.test(id)) {
		throw new Error('station ID must be an IBNR.');
	}
	return _formatStation(id);
};

// todo: find option for absolute number of results

const profile = {
	...baseProfile,
	locale: 'de-DE',
	timezone: 'Europe/Berlin',
	addChecksum: true,

	transformReqBody,
	transformJourneysQuery,
	formatRefreshJourneyReq,

	products: products,

	parseLocation: parseHook(_parseLocation, parseLocWithDetails),
	parseJourney: parseHook(_parseJourney, parseJourneyWithPriceAndTickets),
	parseJourneyLeg: parseHook(_parseJourneyLeg, parseJourneyLegWithLoadFactor),
	parseLine: parseHook(_parseLine, parseLineWithAdditionalName),
	parseArrival: parseHook(_parseArrival, parseArrOrDepWithLoadFactor),
	parseDeparture: parseHook(_parseDeparture, parseArrOrDepWithLoadFactor),
	parseDateTime,
	parseLoadFactor,
	parseHintByCode,
	formatStation,

	generateUnreliableTicketUrls: false,
	refreshJourneyUseOutReconL: true,
	trip: true,
	journeysFromTrip: true,
	radar: true,
	reachableFrom: true,
	lines: false, // `.svcResL[0].res.lineL[]` is missing 🤔
};

export {
	profile,
};
