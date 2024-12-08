import {parseRemarks} from './remarks.js';

const parseJourney = (ctx, j) => { // j = raw journey
	const {profile, opt} = ctx;

	const legs = [];
	for (const l of j.verbindungsAbschnitte) {
		const leg = profile.parseJourneyLeg(ctx, l, null);
		legs.push(leg);
	}

	const res = {
		type: 'journey',
		legs,
		refreshToken: j.ctxRecon || null,
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

	return res;
};

export {
	parseJourney,
};
