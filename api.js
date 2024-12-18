import {createClient} from './index.js';
import {profile as dbProfile} from './p/db/index.js';
import {createHafasRestApi as createApi} from 'hafas-rest-api';
import {loyaltyCardParser} from 'db-rest/lib/loyalty-cards.js';
import {parseBoolean, parseInteger} from 'hafas-rest-api/lib/parse.js';

const mapRouteParsers = (route, parsers) => {
	if (!route.includes('journey')) {
		return parsers;
	}
	return {
		...parsers,
		loyaltyCard: loyaltyCardParser,
		firstClass: {
			description: 'Search for first-class options?',
			type: 'boolean',
			default: 'false',
			parse: parseBoolean,
		},
		age: {
			description: 'Age of traveller',
			type: 'integer',
			defaultStr: '*adult*',
			parse: parseInteger,
		},
	};
};

const config = {
	hostname: process.env.HOSTNAME || 'localhost',
	port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
	name: 'db-vendo-client',
	description: 'db-vendo-client',
	homepage: 'https://github.com/public-transport/db-vendo-client',
	version: '6.0.0',
	docsLink: 'https://github.com/public-transport/db-vendo-client',
	openapiSpec: true,
	logging: true,
	aboutPage: true,
	enrichStations: true,
	etags: 'strong',
	csp: 'default-src \'none\' style-src \'self\' \'unsafe-inline\' img-src https:',
	mapRouteParsers,
};


const start = async () => {
	const vendo = createClient(dbProfile, 'my-hafas-rest-api', config);
	const api = await createApi(vendo, config);

	api.listen(config.port, (err) => {
		if (err) {
			console.error(err);
		}
	});
};

start();
