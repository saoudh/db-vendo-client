# New DB Board and Route Planning APIs (beyond HAFAS and IRIS)

(Beware that a DB journey is what you usually call a trip (a vehicle travelilng at a certain time) and a DB trip is what you usually call a journey (result of a route search from A to B).)

## RIS::Boards
https://apis.deutschebahn.com/db/apis/ris-boards/v1/public/

EPs:
* departures/<evaNo>
* arrivals/<evaNo>

Notes:
* docs (also helpful for other RIS-based APIs below): https://developers.deutschebahn.com/db-api-marketplace/apis/product/ris-boards-transporteure/api/ris-boards-transporteure#/RISBoards_151/overview
* needs an API Key
* provides remarks
* does not provide loadFactor
* no route planning
* uses RIS trip IDs
* boards up to 12 hours

## bahnhof.de RIS
https://www.bahnhof.de/api/boards/departures?evaNumbers=8000105&filterTransports=BUS&duration=60&locale=de

Notes:
* no API Key needed
* provides remarks
* uses RIS trip IDs
* no route planning
* boards up to 6 hours, only from current time (or unknown parameter)

## Regio Guide RIS
https://regio-guide.de/@prd/zupo-travel-information/api/public/ri/

EPs:
* departure/8000105?modeOfTransport=HIGH_SPEED_TRAIN,REGIONAL_TRAIN,CITY_TRAIN,INTER_REGIONAL_TRAIN,UNKNOWN,BUS,TRAM,SUBWAY&timeStart=2024-12-11T15:08:25.678Z&timeEnd=2024-12-12T01:53:25.678&expandTimeFrame=TIME_END&&occupancy=true
* board/arrival/<evaNo>
* routing-search (with POST body, see regio-guide.de)
* trip/<tripId-from-routing-search>
* journey/<journeyId-from-trip>

Notes:
* no API Key needed
* no remarks in boards (or with unknown param), only some in journey
* uses RIS trip IDs, does not expose them directly in the routing-search response
* loadFactor for some regional services, not for long distance services
* boards up to 12 hours

## Vendo Navigator API
https://app.vendo.noncd.db.de/mob/

EPs:
* bahnhofstafel/abfahrt
* angebote/fahrplan (for route planning)

Notes:
* no API Key needed
* used by new DB Navigator
* to be investigated, reverse engineering of DB Navigator needed
* probably uses HAFAS trip IDs

## Vendo bahn.de API
https://int.bahn.de/web/api/

EPs:
* angebote/fahrplan (for route planning)
* reiseloesung/orte
* reiseloesung/orte/nearby

Notes:
* no API Key needed
* uses HAFAS trip IDs
* provides loadFactor
* no boards (?)

