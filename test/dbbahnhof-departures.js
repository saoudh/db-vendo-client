import tap from 'tap';

import {createClient} from '../index.js';
import {profile as rawProfile} from '../p/dbbahnhof/index.js';
import res from './fixtures/dbbahnhof-departures.json' with { type: 'json' };
import {dbDepartures as expected} from './fixtures/dbbahnhof-departures.js';

const client = createClient(rawProfile, 'public-transport/hafas-client:test', {enrichStations: false});
const {profile} = client;

const opt = {
	direction: null,
	duration: 10,
	linesOfStops: true,
	remarks: true,
	stopovers: false,
	includeRelatedStations: true,
	when: '2019-08-19T20:30:00+02:00',
	products: {},
};

tap.test('parses a bahnhof.de departure correctly', (t) => {
	const ctx = {profile, opt, common: null, res};
	const arrivals = res.entries.flat()
		.map(d => profile.parseArrival(ctx, d));

	t.same(arrivals, expected);
	t.end();
});
