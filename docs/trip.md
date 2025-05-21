# `trip(id, [opt])`

This method can be used to refetch information about a trip – a vehicle stopping at a set of stops at specific times.

Let's say you used [`journeys`](journeys.md) and now want to get more up-to-date data about the arrival/departure of a leg. You'd pass in the trip ID from `leg.tripId`, e.g. `'1|24983|22|86|18062017'`, and the name of the line from `leg.line.name` like this:

```js
import {createClient} from 'db-vendo-client'
import {profile as dbnavProfile} from 'db-vendo-client/p/dbnav/index.js'

const userAgent = 'link-to-your-project-or-email' // adapt this to your project!
const client = createClient(dbnavProfile, userAgent)

const {journeys} = client.journeys('8000096', '8000105', {results: 1})
const leg = journeys[0].legs[0]

await client.trip(leg.tripId)
```

With `opt`, you can override the default options, which look like this:

```js
{
	stopovers: true, // return stations on the way?
	polyline: false, // return a shape for the trip? only supported with HAFAS trip id (i.e. not with a trip id from a departure/arrival board of the `db` profile)
	subStops: true, // not supported
	entrances: true, // not supported
	remarks: true, // parse & expose hints & warnings?
	language: 'en' // language to get results in
}
```

## Response

*Note:* As stated in the [*Friendly Public Transport Format* v2 draft spec](https://github.com/public-transport/friendly-public-transport-format/blob/3bd36faa721e85d9f5ca58fb0f38cdbedb87bbca/spec/readme.md), the returned `departure` and `arrival` times include the current delay. The `departureDelay`/`arrivalDelay` fields express how much they differ from the schedule.


```js
import {createClient} from 'db-vendo-client'
import {profile as dbnavProfile} from 'db-vendo-client/p/dbnav/index.js'

const client = createClient(dbnavProfile)

const {
	trip,
	realtimeDataUpdatedAt,
} = await client.trip('1|31431|28|86|17122017', 'S9', {
	when: 1513534689273,
})
```

`realtimeDataUpdatedAt` is currently not set in db-vendo-client, because the upstream APIs don't provide it.

When running the code above, `trip` looked like this:

```js
{
	id: '1|31431|28|86|17122017',
	direction: 'S Spandau',
	line: {
		type: 'line',
		id: '18299',
		fahrtNr: '12345',
		name: 'S9',
		public: true,
		mode: 'train',
		product: 'suburban',
		symbol: 'S',
		nr: 9,
		metro: false,
		express: false,
		night: false,
		operator: {
			type: 'operator',
			id: 's-bahn-berlin-gmbh',
			name: 'S-Bahn Berlin GmbH'
		}
	},
	currentLocation: {
		type: 'location',
		latitude: 52.447455,
		longitude: 13.522464,
	},

	origin: {
		type: 'station',
		id: '900000260005',
		name: 'S Flughafen Berlin-Schönefeld',
		location: {
			type: 'location',
			latitude: 52.390796,
			longitude: 13.51352
		},
		products: {
			suburban: true,
			subway: false,
			tram: false,
			bus: true,
			ferry: false,
			express: false,
			regional: true
		}
	},
	departure: '2017-12-17T18:37:00+01:00',
	plannedDeparture: '2017-12-17T18:37:00+01:00',
	departureDelay: null,
	departurePlatform: '13',
	plannedDeparturePlatform: '13',

	destination: {
		type: 'station',
		id: '900000029101',
		name: 'S Spandau',
		location: {
			type: 'location',
			latitude: 52.534794,
			longitude: 13.197477
		},
		products: {
			suburban: true,
			subway: false,
			tram: false,
			bus: true,
			ferry: false,
			express: true,
			regional: true
		}
	},
	arrival: '2017-12-17T19:50:30+01:00',
	plannedArrival: '2017-12-17T19:49:00+01:00',
	arrivalDelay: 90,
	arrivalPlatform: '3a',
	plannedArrivalPlatform: '2',

	stopovers: [ /* … */ ]
}
```

### `polyline` option

Only supported with HAFAS trip id (i.e. not with a trip id from a departure/arrival board of the `db` profile).

If you pass `polyline: true`, the trip will have a `polyline` field, containing a [GeoJSON](http://geojson.org) [`FeatureCollection`](https://tools.ietf.org/html/rfc7946#section-3.3) of [`Point`s](https://tools.ietf.org/html/rfc7946#appendix-A.1). 

```js
{
	type: 'FeatureCollection',
	features: [
		{
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [13.3875, 52.43993] // longitude, latitude
			}
		},
		/* … */
		{
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [13.38892, 52.49448] // longitude, latitude
			}
		},
		/* … */
		{
			// intermediate point, without associated station
			type: 'Feature',
			properties: {},
			geometry: {
				type: 'Point',
				coordinates: [13.28599, 52.58742] // longitude, latitude
			}
		},
		{
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [13.28406, 52.58915] // longitude, latitude
			}
		}
	]
}
```
