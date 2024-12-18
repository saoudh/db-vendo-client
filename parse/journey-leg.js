import {parseRemarks, isStopCancelled} from './remarks.js';

const locationFallback = (id, name, fallbackLocations) => {
	if (fallbackLocations && (id && fallbackLocations[id] || name && fallbackLocations[name])) {
		return fallbackLocations[id] || fallbackLocations[name];
	}
	return {
		type: 'location',
		id: id,
		name: name,
		location: null,
	};
};

const parseJourneyLeg = (ctx, pt, date, fallbackLocations) => { // pt = raw leg
	const {profile, opt} = ctx;

	const res = {
		origin: pt.halte?.length > 0 ? profile.parseLocation(ctx, pt.halte[0]) : locationFallback(pt.abfahrtsOrtExtId, pt.abfahrtsOrt, fallbackLocations),
		destination: pt.halte?.length > 0 ? profile.parseLocation(ctx, pt.halte[pt.halte.length - 1]) : locationFallback(pt.ankunftsOrtExtId, pt.ankunftsOrt, fallbackLocations),
	};

	const cancelledDep = pt.halte?.length > 0 && isStopCancelled(pt.halte[0]);
	const dep = profile.parseWhen(ctx, date, pt.abfahrtsZeitpunkt, pt.ezAbfahrtsZeitpunkt, cancelledDep);
	res.departure = dep.when;
	res.plannedDeparture = dep.plannedWhen;
	res.departureDelay = dep.delay;
	if (dep.prognosedWhen) {
		res.prognosedDeparture = dep.prognosedWhen;
	}

	const cancelledArr = pt.halte?.length > 0 && isStopCancelled(pt.halte[pt.halte.length - 1]);
	const arr = profile.parseWhen(ctx, date, pt.ankunftsZeitpunkt, pt.ezAnkunftsZeitpunkt, cancelledArr);
	res.arrival = arr.when;
	res.plannedArrival = arr.plannedWhen;
	res.arrivalDelay = arr.delay;
	if (arr.prognosedWhen) {
		res.prognosedArrival = arr.prognosedWhen;
	}

	/* TODO res.reachable risNotizen [
		{
			"key": "text.realtime.connection.brokentrip",
			"value": "Due to delays a connecting service may not be reachable."
		}
	] */

	if ((opt.polylines || opt.polyline) && pt.polylineGroup) {
		res.polyline = profile.parsePolyline(ctx, pt.polylineGroup); // TODO polylines not returned anymore, set "poly": true in request, apparently only works for /reiseloesung/verbindung
	}

	if (pt.verkehrsmittel?.typ === 'WALK') {
		res.public = true;
		res.walking = true;
		res.distance = pt.distanz || null;
		// TODO res.transfer, res.checkin
	} else {
		res.tripId = pt.journeyId;
		res.line = profile.parseLine(ctx, pt) || null;
		res.direction = pt.verkehrsmittel?.richtung || null;

		// TODO res.currentLocation
		if (pt.halte?.length > 0) {
			const arrPl = profile.parsePlatform(ctx, pt.halte[pt.halte.length - 1].gleis, pt.halte[pt.halte.length - 1].ezGleis, cancelledArr);
			res.arrivalPlatform = arrPl.platform;
			res.plannedArrivalPlatform = arrPl.plannedPlatform;
			if (arrPl.prognosedPlatform) {
				res.prognosedArrivalPlatform = arrPl.prognosedPlatform;
			}
			// res.arrivalPrognosisType = null; // TODO

			const depPl = profile.parsePlatform(ctx, pt.halte[0].gleis, pt.halte[0].ezGleis, cancelledDep);
			res.departurePlatform = depPl.platform;
			res.plannedDeparturePlatform = depPl.plannedPlatform;
			if (depPl.prognosedPlatform) {
				res.prognosedDeparturePlatform = depPl.prognosedPlatform;
			}
			// res.departurePrognosisType = null; // TODO


			if (opt.stopovers) {
				res.stopovers = pt.halte.map(s => profile.parseStopover(ctx, s, date));
				// filter stations the train passes without stopping, as this doesn't comply with fptf (yet)
				res.stopovers = res.stopovers.filter((x) => !x.passBy);
			}
			if (opt.remarks) {
				res.remarks = parseRemarks(ctx, pt);
			}
		}

		// TODO cycle, alternatives
	}

	if (cancelledDep || cancelledArr) {
		res.cancelled = true;
		Object.defineProperty(res, 'canceled', {value: true});
	}

	return res;
};

export {
	parseJourneyLeg,
};
