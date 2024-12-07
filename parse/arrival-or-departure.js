import {parseRemarks} from './remarks.js';

const ARRIVAL = 'a';
const DEPARTURE = 'd';

const createParseArrOrDep = (prefix) => {
	if (prefix !== ARRIVAL && prefix !== DEPARTURE) {
		throw new Error('invalid prefix');
	}

	const parseArrOrDep = (ctx, d) => { // d = raw arrival/departure
		const {profile, opt} = ctx;

		const res = {
			tripId: d.journeyID,
			stop: profile.parseLocation(ctx, d.station),
			...profile.parseWhen(ctx, null, d.timeSchedule, d.time, d.canceled),
			...profile.parsePlatform(ctx, d.platformSchedule, d.platform, d.canceled),
			//prognosisType: TODO
			direction: d.transport?.direction?.stopPlaces?.length > 0 && profile.parseStationName(ctx, d.transport?.direction?.stopPlaces[0].name) || null, 
			provenance: profile.parseStationName(ctx, d.transport?.origin?.name) || null,
			line: profile.parseLine(ctx, d) || null,
			remarks: [],
			origin: profile.parseLocation(ctx, d.transport?.origin) || null,
			destination: profile.parseLocation(ctx, d.transport?.destination) || null,
		};

		// TODO pos

		if (d.canceled) {
			res.cancelled = true;
			Object.defineProperty(res, 'canceled', {value: true});
		}

		if (opt.remarks) {
			res.remarks = parseRemarks(ctx, d);
		}
		// TODO opt.stopovers
		return res;
	};

	return parseArrOrDep;
};

export {
	createParseArrOrDep,
};
