import tap from 'tap';
import {parseLine as parse} from '../../parse/line.js';
import {products} from '../../lib/products.js';

const profile = {
	products: products,
	parseOperator: _ => null,
};
const ctx = {
	data: {},
	opt: {},
	profile,
};

tap.test('parses db ICE leg correctly', (t) => {
	const input = {
		journeyId: 'foo',
		verkehrsmittel: {
			produktGattung: 'ICE',
			kategorie: 'ICE',
			name: 'ICE 229',
			nummer: '229',
			richtung: 'Wien Hbf',
			typ: 'PUBLICTRANSPORT',
			zugattribute: [{
				kategorie: 'BEFÖRDERER',
				key: 'BEF',
				value: 'DB Fernverkehr AG, Österreichische Bundesbahnen',
			}, {
				kategorie: 'FAHRRADMITNAHME',
				key: 'FR',
				value: 'Bicycles conveyed - subject to reservation',
				teilstreckenHinweis: '(Mainz Hbf - Wien Meidling)',
			}],
			kurzText: 'ICE',
			mittelText: 'ICE 229',
			langText: 'ICE 229',
		},
	};
	const expected = {
		type: 'line',
		id: 'ice-229',
		fahrtNr: '229',
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


tap.test('parses db Bus trip correctly', (t) => {
	const input = {
		reisetag: '2024-12-07',
		regulaereVerkehrstage: 'not every day',
		irregulaereVerkehrstage: '7., 14. Dec 2024',
		zugName: 'Bus 807',
		zugattribute: [
			{
				kategorie: 'INFORMATION',
				key: 'cB',
				value: 'Tel. 0981-9714925, Anmeldung bis 90 Min. vor Abfahrt (Mo-So: 9-15 Uhr)',
			},
		],
		cancelled: false,
	};
	const expected = {
		type: 'line',
		id: 'bus-807',
		fahrtNr: '807',
		name: 'Bus 807',
		public: true,
		product: undefined,
		productName: undefined,
		mode: undefined,
		operator: null,
	};

	t.same(parse(ctx, input), expected);
	t.end();
});

tap.test('parses db trip correctly', (t) => {
	const input = {
		reisetag: '2025-01-17',
		regulaereVerkehrstage: 'daily',
		zugName: 'ag 84100',
	};
	const expected = {
		type: 'line',
		id: 'ag-84100',
		name: 'ag 84100',
		fahrtNr: '84100',
		public: true,
		product: undefined,
		productName: undefined,
		mode: undefined,
		operator: null,
	};
	t.same(parse(ctx, input), expected);
	t.end();
});

tap.test('parses db Bus leg correctly', (t) => {
	const input = {
		journeyId: 'foo',
		verkehrsmittel: {
			produktGattung: 'BUS',
			kategorie: 'Bus',
			linienNummer: '807',
			name: 'Bus 807',
			nummer: '807',
			richtung: 'Bahnhof, Dombühl',
			typ: 'PUBLICTRANSPORT',
			zugattribute: [
				{
					kategorie: 'INFORMATION',
					key: 'cB',
					value: 'Tel. 0981-9714925, Anmeldung bis 90 Min. vor Abfahrt (Mo-So: 9-15 Uhr)',
				},
			],
			kurzText: 'Bus',
			mittelText: 'Bus 807',
			langText: 'Bus 807',
		},
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
		operator: null,
	};

	t.same(parse(ctx, input), expected);
	t.end();
});


tap.test('parses ris entry correctly', (t) => {
	const input = {
		journeyID: '20241207-79693bf3-2ed5-325f-8a99-154bad5f5cf3',
		transport: {
			type: 'HIGH_SPEED_TRAIN',
			journeyDescription: 'RB 51 (15538)',
			label: '',
			category: 'RB',
			categoryInternal: 'RB',
			number: 15538,
			line: '51',
			replacementTransport: null,
		},
	};
	const expected = {
		type: 'line',
		id: 'rb-51-15538',
		fahrtNr: '15538',
		name: 'RB 51',
		public: true,
		product: 'nationalExpress',
		productName: 'RB',
		mode: 'train',
		operator: null,
	};

	t.same(parse(ctx, input), expected);
	t.end();
});

tap.test('parses dbnav trip with long name correctly', (t) => {
	const input = {fahrplan: {regulaererFahrplan: 'daily'}, kurztext: 'ag', mitteltext: 'ag RE22', langtext: 'ag RE22', gleis: '13', himNotizen: [], echtzeitNotizen: [], verkehrsmittelNummer: '84100', richtung: 'Nürnberg Hbf', produktGattung: 'RB', reisetag: '2025-01-17'};
	const expected = {
		type: 'line',
		id: 'ag-re22',
		name: 'ag RE22',
		fahrtNr: '84100',
		public: true,
		productName: 'ag',
		product: 'regional',
		mode: 'train',
		operator: null,
	};
	t.same(parse(ctx, input), expected);
	t.end();
});

tap.test('parses dbnav trip sbahn correctly', (t) => {
	const input = {fahrplan: {regulaererFahrplan: 'Mo - Sa', tageOhneFahrt: 'not 18., 21. Apr 2025, 1., 29. May 2025, 9., 19. Jun 2025, 3. Oct 2025, 1. Nov 2025'}, kurztext: 'S', mitteltext: 'S 6', gleis: '4', attributNotizen: [], echtzeitNotizen: [], himNotizen: [], verkehrsmittelNummer: '6', richtung: 'Köln-Worringen', produktGattung: 'SBAHN', reisetag: '2025-01-10'};
	const expected = {
		type: 'line',
		id: 's-6',
		fahrtNr: '6',
		name: 'S 6',
		public: true,
		productName: 'S',
		mode: 'train',
		product: 'suburban',
		operator: null,
	};
	t.same(parse(ctx, input), expected);
	t.end();
});

tap.test('parses dbnav leg with long name correctly', (t) => {
	const input = {administrationId: 'S9____', risZuglaufId: 'ag_84100', risAbfahrtId: '8001679_2025-01-17T16:20:00+01:00', kurztext: 'ag', mitteltext: 'ag RE22', langtext: 'ag RE22 (63070) / ag RE22 (84100)', zuglaufId: 'foo', reservierungsMeldungen: [], nummer: 0, abschnittsDauer: 3900, typ: 'FAHRZEUG', verkehrsmittelNummer: '84100', richtung: 'Nürnberg Hbf', produktGattung: 'RB', wagenreihung: false};
	const expected = {
		type: 'line',
		id: 'ag-84100',
		fahrtNr: '84100',
		name: 'ag RE22',
		public: true,
		productName: 'ag',
		mode: 'train',
		product: 'regional',
		adminCode: 'S9____',
		operator: null,
	};
	t.same(parse(ctx, input), expected);
	t.end();
});

tap.test('parses dbnav leg sbahn correctly', (t) => {
	const input = {
		administrationId: '8003S_',
		risZuglaufId: 'S_31600',
		risAbfahrtId: '8003368_2025-01-10T17:21:00+01:00',
		kurztext: 'S',
		mitteltext: 'S 6',
		langtext: 'S 6',
		zuglaufId: '2|#VN#1#ST#1736364871#PI#1#ZI#212722#TA#5#DA#100125#1S#8004948#1T#1614#LS#8003373#LT#1746#PU#81#RT#1#CA#s#ZE#6#ZB#S      6#PC#4#FR#8004948#FT#1614#TO#8003373#TT#1746#',
		nummer: 4,
		typ: 'FAHRZEUG',
		abgangsDatum: '2025-01-10T17:21:00+01:00',
		ankunftsDatum: '2025-01-10T17:23:00+01:00',
		verkehrsmittelNummer: '6',
		richtung: 'Köln-Worringen',
		produktGattung: 'SBAHN',
		wagenreihung: true,
	};
	const expected = {
		type: 'line',
		id: 's-31600',
		fahrtNr: '31600',
		name: 'S 6',
		public: true,
		productName: 'S',
		mode: 'train',
		product: 'suburban',
		adminCode: '8003S_',
		operator: null,
	};
	t.same(parse(ctx, input), expected);
	t.end();
});


tap.test('parses dbnav board ruf correctly', (t) => {
	const input = {zuglaufId: 'foo', kurztext: 'RUF', mitteltext: 'RUF 9870', produktGattung: 'ANRUFPFLICHTIGEVERKEHRE'};
	const expected = {
		type: 'line',
		id: 'ruf-9870',
		name: 'RUF 9870',
		fahrtNr: '9870',
		public: true,
		product: 'taxi',
		productName: 'RUF',
		mode: 'taxi',
		operator: null,
	};
	t.same(parse(ctx, input), expected);
	t.end();
});

tap.test('parses regio guide ruf correctly', (t) => {
	const input = {train: {journeyId: 'foo', category: 'RUF', type: 'SHUTTLE', no: 47403, lineName: '9870'}, category: 'SHUTTLE', administration: {id: 'vrn062', operatorCode: 'DPN', operatorName: 'Nahreisezug'}};
	const expected = {
		type: 'line',
		id: 'ruf-9870-47403',
		name: 'RUF 9870',
		fahrtNr: '47403',
		public: true,
		product: 'taxi',
		productName: 'RUF',
		mode: 'taxi',
		adminCode: 'vrn062',
		operator: null,
	};

	t.same(parse(ctx, input), expected);
	t.end();
});


tap.test('parses regio guide trip line correctly', (t) => {
	const input = {
		name: 'S 5',
		no: 36552,
		journeyId: '20250114-2080f6df-62d4-3c0f-8a89-0db06bc5c2c8',
		tenantId: 'hessen',
		administrationId: '800528',
		operatorName: 'DB Regio, S-Bahn Rhein-Main',
		operatorCode: 'DB',
		category: 'S',
		type: 'CITY_TRAIN',
	};
	const expected = {
		type: 'line',
		id: 's-5-36552',
		name: 'S 5',
		fahrtNr: '36552',
		public: true,
		product: 'suburban',
		productName: 'S',
		mode: 'train',
		adminCode: '800528',
		operator: null,
	};

	t.same(parse(ctx, input), expected);
	t.end();
});
