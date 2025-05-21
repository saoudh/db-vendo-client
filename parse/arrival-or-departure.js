const ARRIVAL = 'a';
const DEPARTURE = 'd';

const createParseArrOrDep = (prefix) => {
	if (prefix !== ARRIVAL && prefix !== DEPARTURE) {
		throw new Error('invalid prefix');
	}

	const parseArrOrDep = (ctx, d) => { // d = raw arrival/departure
		const {profile, opt} = ctx;
		const cancelled = profile.parseCancelled(d);
		const res = {
			tripId: d.journeyID || d.journeyId || d.train?.journeyId || d.zuglaufId,
			stop: profile.parseLocation(ctx, d.station || d.abfrageOrt || d.stopPlace || {bahnhofsId: d.bahnhofsId}),
			...profile.parseWhen(
				ctx,
				null,
				d.timeSchedule || d.time || d.zeit || d.abgangsDatum || d.ankunftsDatum,
				d.timeType != 'SCHEDULE' ? d.timePredicted || d.timeDelayed || d.time || d.ezZeit || d.ezAbgangsDatum || d.ezAnkunftsDatum : null,
				cancelled),
			...profile.parsePlatform(ctx, d.platformSchedule || d.platform || d.gleis, d.platformPredicted || d.platform || d.ezGleis, cancelled),
			// prognosisType: TODO
			direction: d.transport?.direction?.stopPlaces?.length > 0 && profile.parseStationName(ctx, d.transport?.direction?.stopPlaces[0].name) || profile.parseStationName(ctx, d.destination?.name || d.richtung || d.terminus) || null,
			provenance: profile.parseStationName(ctx, d.transport?.origin?.name || d.origin?.name || d.abgangsOrt?.name) || null,
			line: profile.parseLine(ctx, d) || null,
			remarks: [],
			origin: profile.parseLocation(ctx, d.transport?.origin || d.origin) || null,
			destination: profile.parseLocation(ctx, d.transport?.destination || d.destination) || null,
			// loadFactor: profile.parseArrOrDepWithLoadFactor(ctx, d)
		};

		// TODO pos

		if (cancelled) {
			res.cancelled = true;
			Object.defineProperty(res, 'canceled', {value: true});
		}

		if (opt.remarks) {
			res.remarks = profile.parseRemarks(ctx, d);
		}

		if (opt.stopovers || opt.direction) {
			let stopovers = undefined;
			if (Array.isArray(d.ueber)) {
				stopovers = d.ueber
					.map(viaName => profile.parseStopover(ctx, {name: viaName}, null));
			} else if (Array.isArray(d.transport?.via) || Array.isArray(d.viaStops)) {
				stopovers = (d.transport?.via || d.viaStops)
					.map(via => profile.parseStopover(ctx, via, null));
			}
			if (stopovers) {
				if (prefix === ARRIVAL) {
					res.previousStopovers = stopovers;
				} else if (prefix === DEPARTURE) {
					res.nextStopovers = stopovers;
				}
			}
		}

		return res;
	};

	return parseArrOrDep;
};

export {
	createParseArrOrDep,
};
