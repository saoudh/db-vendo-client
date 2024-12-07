# db-vendo-client

**A client for the new "vendo" bahn.de APIs, a drop-in replacement for [hafas-client](https://github.com/public-transport/hafas-client/).**

![ISC-licensed](https://img.shields.io/github/license/public-transport/hafas-client.svg)
[![support Jannis via GitHub Sponsors](https://img.shields.io/badge/support%20Jannis-donate-fa7664.svg)](https://github.com/sponsors/derhuerst)

This is a very early version. What works:

* rudimentary `/journeys` including lowest prices
* `/locations`, `/locations/nearby`
* `/departures`, `/arrivals` (requires a DB API Key for RIS::Boards, maybe you find one somewhere ;)

What doesn't work (yet, see TODO's scattered around the code):

* `/journeys` details like scheduledDays, stop/station groups, tickets, some line details ...
* `/journeys` uses different tripIds compared to departure and arrival boards...
* certain stop details like products for `/locations` and geopositions for departures and arrivals
* some query options like BahnCards etc. 
* all other endpoints

Feel free report anything that you stumble upon via Issues or create a PR :)

Also consult the relevant **[documentation](https://github.com/public-transport/hafas-rest-api/docs/readme.md)** of [hafas-client](https://github.com/public-transport/hafas-client/) (but beware of the limited functionality of db-vendo-client).


## Background

After DB has switched to the new "vendo" platform for bahn.de and DB Navigator, the old [HAFAS](https://de.wikipedia.org/wiki/HAFAS) api (see [hafas-client](https://github.com/public-transport/hafas-client/)) seems to become less and less reliable (server unreachable, missing prices, etc.) This project aims to enable easy switching to the new APIs. However, not all information will be available from the new APIs.

Strictly speaking, permission is necessary to use this library with the bahn.de APIs.

## Usage

See an example in [api.js](api.js). It shows how you can use `db-vendo-client` together with `hafas-rest-api` in order to run a [FPTF](https://github.com/public-transport/friendly-public-transport-format) API server.

There are [community-maintained TypeScript typings available as `@types/hafas-client`](https://www.npmjs.com/package/@types/hafas-client). 

For the `/departures` and `/arrivals` endpoints, `DB_API_KEY` and `DB_CLIENT_ID` environment variables for RIS::Boards have to be set.

## API

[API documentation](docs/readme.md)


## Related Projects

- [hafas-client](https://github.com/public-transport/hafas-client/) – including further related projects
- [db-rest](https://github.com/derhuerst/db-rest/) – for the legacy DB HAFAS endpoint
- [`*.transport.rest`](https://transport.rest/) – Public APIs wrapping some HAFAS endpoints.

## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, please [open an Issue](https://github.com/public-transport/hafas-client/issues).

This project needs help! Check the [list of "help wanted" Issues](https://github.com/public-transport/hafas-client/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22).

If you're contributing code, please read the [contribution guidelines](contributing.md).
