# `stop(id, [opt])`

This endpoint is not available with `dbweb` profile.

`id` must be in one of these formats:

```js
// a stop/station ID, in a format compatible with the profile you use
'900000123456'

// an FPTF `stop`/`station` object
{
	type: 'station',
	id: '900000123456',
	name: 'foo station',
	location: {
		type: 'location',
		latitude: 1.23,
		longitude: 3.21
	}
}
```

With `opt`, you can override the default options, which look like this:

```js
{
	subStops: true, // not supported
	entrances: true, // not supported
	linesOfStops: false, // parse & expose lines at the stop/station?
	language: 'en' // language to get results in
}
```

## Response


```js
import {createClient} from 'hafas-client'
import {profile as dbProfile} from 'hafas-client/p/db/index.js'

const userAgent = 'link-to-your-project-or-email' // adapt this to your project!
const client = createClient(dbProfile, userAgent)

await client.stop('900000042101') // U Spichernstr.
```

The result may look like this:

```js
{
	type: 'stop',
	id: '900000042101',
	name: 'U Spichernstr.',
	location: {
		type: 'location',
		latitude: 52.496581,
		longitude: 13.330616
	},
	products: {
		suburban: false,
		subway: true,
		tram: false,
		bus: true,
		ferry: false,
		express: false,
		regional: false
	},
	lines: [ {
		type: 'line',
		id: 'u1',
		mode: 'train',
		product: 'subway',
		public: true,
		name: 'U1',
	},
	// …
	{
		type: 'line',
		id: 'n9',
		mode: 'bus',
		product: 'bus',
		public: true,
		name: 'N9',
	} ]
}
```
