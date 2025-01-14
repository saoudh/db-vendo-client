# `locations(query, [opt])`

`query` must be an string (e.g. `'Alexanderplatz'`).

With `opt`, you can override the default options, which look like this:

```js
{
	  fuzzy:     true // not supported
	, results:   5 // how many search results?
	, stops:     true // return stops/stations?
	, addresses: true
	, poi:       true // points of interest
	, subStops: true // not supported
	, entrances: true // not supported
	, linesOfStops: false // not supported
	, language: 'en' // language to get results in
}
```

## Response


```js
import {createClient} from 'db-vendo-client'
import {profile as dbnavProfile} from 'db-vendo-client/p/dbnav/index.js'

const userAgent = 'link-to-your-project-or-email' // adapt this to your project!
const client = createClient(dbnavProfile, userAgent)

await client.locations('Alexanderplatz', {results: 3})
```

The result may look like this:

```js
[ {
	type: 'stop',
	id: '900000100003',
	name: 'S+U Alexanderplatz',
	location: {
		type: 'location',
		latitude: 52.521508,
		longitude: 13.411267
	},
	products: {
		suburban: true,
		subway: true,
		tram: true,
		bus: true,
		ferry: false,
		express: false,
		regional: true
	}
}, { // point of interest
	type: 'location',
	id: '900980709',
	poi: true,
	name: 'Berlin, Holiday Inn Centre Alexanderplatz****',
	latitude: 52.523549,
	longitude: 13.418441
}, { // point of interest
	type: 'location',
	id: '900980176',
	poi: true,
	name: 'Berlin, Hotel Agon am Alexanderplatz',
	latitude: 52.524556,
	longitude: 13.420266
} ]
```
