import tap from 'tap';
import {parseOperator as parse} from '../../parse/operator.js';

const ctx = {
	data: {},
	opt: {},
	profile: {},
};

tap.test('parses an operator correctly', (t) => {
	const op = [{
		kategorie: 'BEFÖRDERER',
		key: 'BEF',
		value: 'DB Fernverkehr AG',
	}, {
		kategorie: 'FAHRRADMITNAHME',
		key: 'FR',
		value: 'Bicycles conveyed - subject to reservation',
	}];

	t.same(parse(ctx, op), {
		type: 'operator',
		id: 'db-fernverkehr-ag',
		name: 'DB Fernverkehr AG',
	});
	t.end();
});


tap.test('parses nothing', (t) => {
	const op = [{
		kategorie: 'INFORMATION',
		key: 'cB',
		value: 'Tel. 0981-9714925, Anmeldung bis 90 Min. vor Abfahrt (Mo-So: 9-15 Uhr)',
	}];

	t.same(parse(ctx, op), null);
	t.end();
});


tap.test('parses dbnav operator correctly', (t) => {
	const op = [{text: 'DB Fernverkehr AG', key: 'OP'}];

	t.same(parse(ctx, op), {
		type: 'operator',
		id: 'db-fernverkehr-ag',
		name: 'DB Fernverkehr AG',
	});
	t.end();
});


tap.test('parses db regio guide trip operator correctly', (t) => {
	const op = {
		name: 'S 5',
		no: 36552,
		journeyId: '20250114-2080f6df-62d4-3c0f-8a89-0db06bc5c2c8',
		tenantId: 'hessen',
		administrationId: '800528',
		operatorName: 'DB Regio, S-Bahn Rhein-Main',
		operatorCode: 'DB',
		category: 'S',
		type: 'CITY_TRAIN',
		date: '2025-01-14T16:08:00+01:00',
	};

	t.same(parse(ctx, op), {
		type: 'operator',
		id: 'DB',
		name: 'DB Regio, S-Bahn Rhein-Main',
	});
	t.end();
});
