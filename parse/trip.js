import minBy from 'lodash/minBy.js';
import maxBy from 'lodash/maxBy.js';
import last from 'lodash/last.js';

const parseTrip = (ctx, t) => { // t = raw trip
	const {profile} = ctx;

	// pretend the trip is a leg in a journey
	const fakeLeg = {
		type: 'JNY',
		dep: Array.isArray(t.stopL)
			? minBy(t.stopL, 'idx') || t.stopL[0]
			: {},
		arr: Array.isArray(t.stopL)
			? maxBy(t.stopL, 'idx') || last(t.stopL)
			: {},
		jny: t,
	};

	const trip = profile.parseJourneyLeg(ctx, fakeLeg);
	trip.id = trip.tripId; // TODO journeyId
	delete trip.tripId;
	delete trip.reachable;

	// TODO opt.scheduledDays
	return trip;
};

export {
	parseTrip,
};
