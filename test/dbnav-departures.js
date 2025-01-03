// todo: use import assertions once they're supported by Node.js & ESLint
// https://github.com/tc39/proposal-import-assertions
import {createRequire} from 'module';
const require = createRequire(import.meta.url);

import tap from 'tap';

import {createClient} from '../index.js';
import {profile as rawProfile} from '../p/db/index.js';
const res = require('./fixtures/dbnav-departures.json');
import {dbnavDepartures as expected} from './fixtures/dbnav-departures.js';

const client = createClient(rawProfile, 'public-transport/hafas-client:test');
const {profile} = client;

const opt = {
	direction: null,
	duration: 10,
	linesOfStops: true,
	remarks: true,
	stopovers: true,
	includeRelatedStations: true,
	when: '2019-08-19T20:30:00+02:00',
	products: {},
};

tap.test('parses a dbnav departure correctly', (t) => {
	const ctx = {profile, opt, common: null, res};
	const departures = res.bahnhofstafelAbfahrtPositionen.map(d => profile.parseDeparture(ctx, d));
	t.same(departures, expected);
	t.end();
});