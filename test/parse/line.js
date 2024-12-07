import tap from 'tap';
import {parseLine as parse} from '../../parse/line.js';

const profile = {
	products: [
		{
			id: 'nationalExpress',
			mode: 'train',
			name: 'InterCityExpress',
			short: 'ICE',
			vendo: 'ICE',
			ris: 'HIGH_SPEED_TRAIN',
			default: true,
		},
		{
			id: 'bus',
			mode: 'bus',
			name: 'Bus',
			short: 'B',
			vendo: 'BUS',
			ris: 'BUS',
			default: true,
		},
	],
	parseOperator: _ => null
};
const ctx = {
	data: {},
	opt: {},
	profile,
};

tap.test('parses ICE leg correctly', (t) => {
	const input = {
		"journeyId": "foo",
		"verkehrsmittel": {
			"produktGattung": "ICE",
			"kategorie": "ICE",
			"name": "ICE 229",
			"nummer": "229",
			"richtung": "Wien Hbf",
			"typ": "PUBLICTRANSPORT",
			"zugattribute": [{
				"kategorie": "BEFÖRDERER",
				"key": "BEF",
				"value": "DB Fernverkehr AG, Österreichische Bundesbahnen"
			},{
				"kategorie": "FAHRRADMITNAHME",
				"key": "FR",
				"value": "Bicycles conveyed - subject to reservation",
				"teilstreckenHinweis": "(Mainz Hbf - Wien Meidling)"
			}],
			"kurzText": "ICE",
			"mittelText": "ICE 229",
			"langText": "ICE 229"
		}
	};
	const expected = {
		type: 'line',
		id: 'ice-229',
		fahrtNr: 229,
		name: 'ICE 229',
		public: true,
		product: 'nationalExpress',
		productName: 'ICE',
		mode: 'train',
		operator: null,
	};
	t.same(parse(ctx, input), expected);
	t.end();
});


tap.test('parses Bus trip correctly', (t) => {
	const input = {
		"reisetag": "2024-12-07",
		"regulaereVerkehrstage": "not every day",
		"irregulaereVerkehrstage": "7., 14. Dec 2024",
		"zugName": "Bus 807",
		"zugattribute": [
			{
				"kategorie": "INFORMATION",
				"key": "cB",
				"value": "Tel. 0981-9714925, Anmeldung bis 90 Min. vor Abfahrt (Mo-So: 9-15 Uhr)"
			}
		],
		"cancelled": false,
	};
	const expected = {
		type: 'line',
		id: '',
		fahrtNr: undefined,
		name: 'Bus 807',
		public: true,
		product: undefined,
		productName: undefined,
		mode: undefined,
		operator: null
	};

	t.same(parse(ctx, input), expected);
	t.end();
});



tap.test('parses Bus leg correctly', (t) => {
	const input = {
		"journeyId": "foo",
		"verkehrsmittel": {
			"produktGattung": "BUS",
			"kategorie": "Bus",
			"linienNummer": "807",
			"name": "Bus 807",
			"nummer": "807",
			"richtung": "Bahnhof, Dombühl",
			"typ": "PUBLICTRANSPORT",
			"zugattribute": [
				{
					"kategorie": "INFORMATION",
					"key": "cB",
					"value": "Tel. 0981-9714925, Anmeldung bis 90 Min. vor Abfahrt (Mo-So: 9-15 Uhr)"
				}
			],
			"kurzText": "Bus",
			"mittelText": "Bus 807",
			"langText": "Bus 807"
		}
	};
	const expected = {
		type: 'line',
		id: 'bus-807',
		fahrtNr: '807',
		name: 'Bus 807',
		public: true,
		product: 'bus',
		productName: 'Bus',
		mode: 'bus',
		operator: null
	};

	t.same(parse(ctx, input), expected);
	t.end();
});



tap.test('parses ris entry correctly', (t) => {
	const input = {
		"journeyID": "20241207-79693bf3-2ed5-325f-8a99-154bad5f5cf3",
		"transport": {
			"type": "HIGH_SPEED_TRAIN",
			"journeyDescription": "RB 51 (15538)",
			"label": "",
			"category": "RB",
			"categoryInternal": "RB",
			"number": 15538,
			"line": "51",
			"replacementTransport": null,
		}
	};
	const expected = {
		type: 'line',
		id: 'rb-51-15538',
		fahrtNr: 15538,
		name: 'RB 51 (15538)',
		public: true,
		product: 'nationalExpress',
		productName: 'RB',
		mode: 'train',
		operator: null
	};

	t.same(parse(ctx, input), expected);
	t.end();
});
