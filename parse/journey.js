import {parseRemarks} from './remarks.js';

const createFakeWalkingLeg = (prevLeg, leg) => {
	const fakeWalkingLeg = {
		origin: prevLeg.destination,
		destination: leg.origin,
	};
	fakeWalkingLeg.departure = prevLeg.arrival;
	fakeWalkingLeg.plannedDeparture = prevLeg.plannedArrival;
	fakeWalkingLeg.departureDelay = prevLeg.delay;
	fakeWalkingLeg.arrival = fakeWalkingLeg.departure;
	fakeWalkingLeg.plannedArrival = fakeWalkingLeg.plannedDeparture;
	fakeWalkingLeg.arrivalDelay = fakeWalkingLeg.departureDelay;
	fakeWalkingLeg.public = true;
	fakeWalkingLeg.walking = true;
	fakeWalkingLeg.distance = null;
	return fakeWalkingLeg;
};

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

const trimJourneyId = (journeyId) => {
	if (!journeyId) {
		return null;
	}
	const endOfHafasId = journeyId.lastIndexOf('$');
	if (endOfHafasId != -1) {
		return journeyId.substring(0, endOfHafasId + 1);
	}
	return journeyId;
};

const parseJourney = (ctx, jj) => { // j = raw journey
	const {profile, opt} = ctx;
	const j = jj.verbindung || jj;
	const fallbackLocations = parseLocationsFromCtxRecon(ctx, j);
	const legs = [];
	for (const l of j.verbindungsAbschnitte) {
		const leg = profile.parseJourneyLeg(ctx, l, null, fallbackLocations);
		if (legs.length > 0 && !legs[legs.length - 1].walking && !leg.walking) {
			const fakeWalkingLeg = createFakeWalkingLeg(legs[legs.length - 1], leg);
			legs.push(fakeWalkingLeg);
		}
		legs.push(leg);
	}

	const res = {
		type: 'journey',
		legs,
		refreshToken: trimJourneyId(j.ctxRecon || j.kontext),
	};

	// TODO freq

	if (opt.remarks) {
		res.remarks = parseRemarks(ctx, j);
	}

	// TODO
	if (opt.scheduledDays && j.serviceDays) {
		// todo [breaking]: rename to scheduledDates
		// TODO parse scheduledDays as before
		res.serviceDays = j.serviceDays.map(d => ({
			irregular: d.irregular,
			lastDateInPeriod: d.lastDateInPeriod || d.letztesDatumInZeitraum,
			planningPeriodBegin: d.planningPeriodBegin || d.planungsZeitraumAnfang,
			planningPeriodEnd: d.planningPeriodEnd || d.planungsZeitraumEnde,
			regular: d.regular,
			weekdays: d.weekdays || d.wochentage,
		}));
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
