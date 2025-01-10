const parseTrip = (ctx, t, id) => { // t = raw trip
	const {profile} = ctx;

	// pretend the trip is a leg in a journey
	const trip = profile.parseJourneyLeg(ctx, t);
	trip.id = trip.tripId || id; // TODO journeyId
	delete trip.tripId;
	delete trip.reachable;
	trip.cancelled = profile.parseCancelled(t);

	// TODO opt.scheduledDays
	return trip;
};

export {
	parseTrip,
};
