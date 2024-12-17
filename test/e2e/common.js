import tap from 'tap';

import {createClient} from '../../index.js';
import {profile as dbProfile} from '../../p/db/index.js';

const client = createClient(dbProfile, 'public-transport/hafas-client:test');

tap.test('exposes the profile', (t) => {
	t.ok(client.profile);
	t.equal(client.profile.endpoint, dbProfile.endpoint);
	t.end();
});
