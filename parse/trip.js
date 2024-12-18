const parseTrip = (ctx, t) => { // t = raw trip
	const {profile} = ctx;

	// pretend the trip is a leg in a journey
	const trip = profile.parseJourneyLeg(ctx, t);
	trip.id = trip.tripId; // TODO journeyId
	delete trip.tripId;
	delete trip.reachable;
	trip.cancelled = t.cancelled;

	// TODO opt.scheduledDays
	return trip;
};

export {
	parseTrip,
};
