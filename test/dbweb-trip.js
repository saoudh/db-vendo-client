import tap from 'tap';

import {createClient} from '../index.js';
import {profile as rawProfile} from '../p/dbweb/index.js';
import res from './fixtures/dbweb-trip.json' with { type: 'json' };
import {dbwebTrip as expected} from './fixtures/dbweb-trip.js';

const client = createClient(rawProfile, 'public-transport/hafas-client:test', {enrichStations: false});
const {profile} = client;

const opt = {
	stopovers: true,
	remarks: true,
	products: {},
};

tap.test('parses a trip correctly (DB)', (t) => {
	const ctx = {profile, opt, common: null, res};
	const trip = profile.parseTrip(ctx, res, 'foo');

	t.same(trip, expected.trip);
	t.end();
});
