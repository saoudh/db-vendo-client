import tap from 'tap';

import {createClient} from '../index.js';
import {profile as rawProfile} from '../p/dbris/index.js';
import res from './fixtures/dbris-arrivals.json' with { type: 'json' };
import {dbArrivals as expected} from './fixtures/dbris-arrivals.js';

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

tap.test('parses a RIS::Boards arrival correctly', (t) => {
	const ctx = {profile, opt, common: null, res};
	const arrivals = res.arrivals.map(d => profile.parseArrival(ctx, d));

	t.same(arrivals, expected);
	t.end();
});
