import {parseRemarks} from './remarks.js';

const parseLocationsFromCtxRecon = (ctx, j) => {
	return (j.ctxRecon || j.kontext)
		.split('$')
		.map(e => ctx.profile.parseLocation(ctx, {id: e}))
		.filter(e => e.latitude || e.location?.latitude)
		.reduce((map, e) => {
			map[e.id] = e;
			map[e.name] = e;
			return map;
		}, {});
};

const parseJourney = (ctx, jj) => { // j = raw journey
	const {profile, opt} = ctx;
	const j = jj.verbindung || jj;
	const fallbackLocations = parseLocationsFromCtxRecon(ctx, j);
	const legs = [];
	for (const l of j.verbindungsAbschnitte) {
		const leg = profile.parseJourneyLeg(ctx, l, null, fallbackLocations);
		legs.push(leg);
	}

	const res = {
		type: 'journey',
		legs,
		refreshToken: j.ctxRecon || j.kontext || null,
	};

	// TODO freq

	if (opt.remarks) {
		res.remarks = parseRemarks(ctx, j);
	}

	// TODO
	if (opt.scheduledDays && j.serviceDays) {
		// todo [breaking]: rename to scheduledDates
		// res.scheduledDays = profile.parseScheduledDays(ctx, j.serviceDays);
	}

	res.price = profile.parsePrice(ctx, jj);
	const tickets = profile.parseTickets(ctx, jj);
	if (tickets) {
		res.tickets = tickets;
	}

	return res;
};

export {
	parseJourney,
};
