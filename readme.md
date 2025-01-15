# db-vendo-client

**A client for the new "vendo"/"movas" bahn.de APIs, a drop-in replacement for [hafas-client](https://github.com/public-transport/hafas-client/).**

![ISC-licensed](https://img.shields.io/github/license/public-transport/db-vendo-client.svg)
[![support Jannis via GitHub Sponsors](https://img.shields.io/badge/support%20Jannis-donate-fa7664.svg)](https://github.com/sponsors/derhuerst)

This is a very early version. What works:

* `journeys()`, `refreshJourney()` including tickets
* `locations()`, `nearby()`,
* `departures()`, `arrivals()` boards
* `trip()`

What doesn't work (yet, see TODO's scattered around the code):

* `journeys()` details like scheduledDays, stop/station groups, some line details ...
* loadFactor and other details in boards
* certain stop details like products for `locations()` and geopositions and remarks for boards – this can be remedied by turning on `enrichStations` in the config, enriching location info with [db-hafas-stations](https://github.com/derhuerst/db-hafas-stations).
* some query options/filters (e.g. routingMode for journeys, direction for boards)
* all other endpoints (`tripsByName()`, `radar()`, `journeysFromTrip()`, `reachableFrom()`, `remarks()`, `lines()`, `station()`)

Depending on the configured profile, db-vendo-client will use multiple different DB APIs that offer varying functionality, so choose wisely:

|                       | `db` Profile        | `dbnav` Profile |
| -------------         | -------------     | ------------- |
| no API key required   | ✅                | ✅ |
| max duration boards   | 12h | 1h |
| remarks               | not for boards | ✅ (still no `remarks()` endpoint) |
| cancelled trips       | not contained in boards | contained with cancelled flag |
| tickets               | only for `refreshJourney()`, mutually exclusive with polylines | only for `refreshJourney()`, mutually exclusive with polylines |
| polylines             | only for `refreshJourney()` (mutually exclusive with tickets) and for `trip()` (only for HAFAS trip ids) | only for `refreshJourney()/trip()`, mutually exclusive with tickets |
| trip ids used         | HAFAS trip ids for journeys, RIS trip ids for boards (static on train splits?) | HAFAS trip ids |
| line.id/fahrtNr used  | unreliable/route id for journeys/`trip()`, actual fahrtNr for boards | actual fahrtNr for journeys, unreliable/route id for boards and `trip()` |
| adminCode/operator    | adminCode only for boards | only for journeys |
| `stop()`              | ❌ | ✅ |
| assumed backend API stability | less stable | more stable |

Feel free to report anything that you stumble upon via Issues or create a PR :)

Also consult the **[documentation](docs/readme.md)**.

## Background

After DB has switched to the new "vendo"/"movas" platform for bahn.de and DB Navigator, the old [HAFAS](https://de.wikipedia.org/wiki/HAFAS) API (see [hafas-client](https://github.com/public-transport/hafas-client/)) seems to become less and less reliable (server unreachable, missing prices, etc.) This project aims to enable easy switching to the new APIs. However, not all information will be available from the new APIs.

Actually, db-vendo-client is a wrapper around multiple different APIs, currently the bahn.de API for route planning and the regio-guide RIS API for boards for the `db` profile and the DB Navigator API for the `dbnav` profile. See some [notes about the various new APIs at DB](docs/db-apis.md).

Strictly speaking, permission is necessary to use this library with the DB APIs.

## Usage

Use it as a dependency, e.g. just replacing [hafas-client](https://github.com/public-transport/hafas-client/):

```
npm i db-vendo-client
```

See an example in [api.js](api.js). It shows how you can use `db-vendo-client` together with [hafas-rest-api](https://github.com/public-transport/hafas-rest-api/) in order to run a [FPTF](https://github.com/public-transport/friendly-public-transport-format) API server. The [Dockerfile](Dockerfile) serves this API (using the `dbnav` profile):

```
docker run \
    -e USER_AGENT=my-awesome-program \
    -e DB_PROFILE=dbnav \
    -p 3000:3000 \
    ghcr.io/public-transport/db-vendo-client
```

You may want to generate a client for your programming language for this REST API using the [OpenAPI schema](docs/openapi.yaml) ([open in Swagger Editor](https://editor.swagger.io/?url=https://raw.githubusercontent.com/public-transport/db-vendo-client/refs/heads/main/docs/openapi.yaml)). Note 
that this to be seen more as a starting point for implementation, e.g. some profile-specific details like tickets are missing from this API definition.

There are [community-maintained TypeScript typings available as `@types/hafas-client`](https://www.npmjs.com/package/@types/hafas-client). 

## Related Projects

- [hafas-client](https://github.com/public-transport/hafas-client/) – including further related projects
- [hafas-rest-api](https://github.com/public-transport/hafas-rest-api/) – expose a hafas-client or db-vendo-client instance as a REST API
- [db-rest](https://github.com/derhuerst/db-rest/) – for the legacy DB HAFAS endpoint
- [`*.transport.rest`](https://transport.rest/) – Public APIs wrapping some HAFAS endpoints.

## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, please [open an Issue](https://github.com/public-transport/db-vendo-client/issues).

This project needs help! Check the [list of "help wanted" Issues](https://github.com/public-transport/db-vendo-client/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22).

If you're contributing code, please read the [contribution guidelines](contributing.md).
