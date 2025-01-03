import {getHeaders} from './header.js';

const formatBaseJourneysReq = (ctx) => {
	const {opt} = ctx;

	// TODO opt.accessibility
	// TODO routingMode
	const travellers = ctx.profile.formatTravellers(ctx);
	return {
		autonomeReservierung: false,
		einstiegsTypList: [
			'STANDARD',
		],
		klasse: travellers.klasse,
		reisendenProfil: {
			reisende: travellers.reisende.map(t => {
				return {
					ermaessigungen: [
						t.ermaessigungen[0].art + ' ' + t.ermaessigungen[0].klasse,
					],
					reisendenTyp: t.typ,
					alter: opt.age,
				};
			}),
		},
		reservierungsKontingenteVorhanden: false,
	};
};

const formatJourneysReq = (ctx, from, to, when, outFrwd, journeysRef) => {
	const {profile, opt} = ctx;

	from = profile.formatLocation(profile, from, 'from');
	to = profile.formatLocation(profile, to, 'to');
	const filters = profile.formatProductsFilter({profile}, opt.products || {}, 'dbnav');
	// TODO opt.accessibility
	// TODO routingMode
	let query = formatBaseJourneysReq(ctx);
	query.reiseHin = {
		wunsch: {
			abgangsLocationId: from.lid,
			verkehrsmittel: filters,
			zeitWunsch: {
				reiseDatum: profile.formatTime(profile, when, true),
				zeitPunktArt: outFrwd ? 'ABFAHRT' : 'ANKUNFT',
			},
			viaLocations: opt.via
				? [{locationId: profile.formatLocation(profile, opt.via, 'opt.via').lid}]
				: undefined,
			zielLocationId: to.lid,
			maxUmstiege: opt.transfers || undefined,
			minUmstiegsdauer: opt.transferTime || undefined,
			fahrradmitnahme: opt.bike,
		},
	};
	if (journeysRef) {
		query.reiseHin.wunsch.context = journeysRef;
	}
	return {
		endpoint: ctx.profile.journeysEndpoint,
		body: query,
		headers: getHeaders('application/x.db.vendo.mob.verbindungssuche.v8+json'),
		method: 'post',
	};
};

const formatRefreshJourneyReq = (ctx, refreshToken) => {
	const {profile, opt} = ctx;
	let query = {
		reconCtx: refreshToken,
	};
	if (opt.tickets) {
		query = formatBaseJourneysReq(ctx);
		query.verbindungHin = {kontext: refreshToken};
	}
	return {
		endpoint: opt.tickets ? profile.refreshJourneysEndpointTickets : profile.refreshJourneysEndpointPolyline,
		body: query,
		headers: getHeaders('application/x.db.vendo.mob.verbindungssuche.v8+json'),
		method: 'post',
	};
};

export {
	formatJourneysReq,
	formatRefreshJourneyReq,
};