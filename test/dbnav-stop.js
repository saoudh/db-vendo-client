// todo: use import assertions once they're supported by Node.js & ESLint
// https://github.com/tc39/proposal-import-assertions
import {createRequire} from 'module';
const require = createRequire(import.meta.url);

import tap from 'tap';

import {createClient} from '../index.js';
import {profile as rawProfile} from '../p/dbnav/index.js';
const res = require('./fixtures/dbnav-stop.json');
import {dbnavDepartures as expected} from './fixtures/dbnav-stop.js';

const client = createClient(rawProfile, 'public-transport/hafas-client:test');
const {profile} = client;

const opt = {
	linesOfStops: true,
};

tap.test('parses a dbnav stop correctly', (t) => {
	const ctx = {profile, opt, common: null, res};
	const stop = profile.parseStop(ctx, res, '8000096');
	t.same(stop, expected);
	t.end();
});
