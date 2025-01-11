import tap from 'tap';
import {parseRemarks as parse} from '../../parse/remarks.js';
import {parseDateTime} from '../../parse/date-time.js';

const ctx = {
	data: {},
	opt: {},
	profile: {
		parseHintByCode: _ => null,
		parseDateTime,
		timezone: 'Europe/Berlin',
		locale: 'de-DE',
	},
};


tap.test('parses meldungenAsObject correctly', (t) => {
	const input = {meldungenAsObject: [{
		code: 'MDA-AK-MSG-1000',
		nachrichtKurz: 'Connection is in the past.',
		nachrichtLang: 'Selected connection is in the past.',
		fahrtRichtungKennzeichen: 'HINFAHRT',
	}]};
	const expected = [{
		code: 'MDA-AK-MSG-1000',
		summary: 'Connection is in the past.',
		text: 'Selected connection is in the past.',
		type: 'hint',
	}];

	t.same(parse(ctx, input), expected);
	t.end();
});

tap.test('parses risNotizen correctly', (t) => {
	const input = {risNotizen: [{key: 'FT', value: 'Staff delayed due to earlier journey', routeIdxFrom: 0, routeIdxTo: 12}]};
	const expected = [{
		code: 'FT',
		summary: 'Staff delayed due to earlier journey',
		text: 'Staff delayed due to earlier journey',
		type: 'warning',
	}];

	t.same(parse(ctx, input), expected);
	t.end();
});

tap.test('parses low Prio him himMeldungen correctly', (t) => {
	const input = {himMeldungen: [{
		ueberschrift: 'Construction work.',
		text: 'Advance notice! In the period from 15.12.24 to 17.01.25, construction work will take place',
		prioritaet: 'NIEDRIG',
		modDateTime: '2024-12-03T12:52:29',
	}]};
	const expected = [{
		code: undefined,
		summary: 'Construction work.',
		text: 'Advance notice! In the period from 15.12.24 to 17.01.25, construction work will take place',
		type: 'status',
		modified: '2024-12-03T12:52:29+01:00',
	}];

	t.same(parse(ctx, input), expected);
	t.end();
});

tap.test('parses high Prio him himMeldungen correctly', (t) => {
	const input = {himMeldungen: [{
		ueberschrift: 'Disruption.',
		text: 'Switch repairs between Frankfurt(Main)Hbf and Mannheim Hbf delays rail transport.',
		prioritaet: 'HOCH',
		modDateTime: '2024-12-05T19:01:48',
	}]};
	const expected = [{
		code: undefined,
		summary: 'Disruption.',
		text: 'Switch repairs between Frankfurt(Main)Hbf and Mannheim Hbf delays rail transport.',
		type: 'warning',
		modified: '2024-12-05T19:01:48+01:00',
	}];

	t.same(parse(ctx, input), expected);
	t.end();
});

tap.test('parses zugattribute correctly', (t) => {
	const input = {verkehrsmittel: {zugattribute: [{
		kategorie: 'BEFÖRDERER',
		key: 'BEF',
		value: 'DB Fernverkehr AG',
	}, {
		kategorie: 'FAHRRADMITNAHME',
		key: 'FR',
		value: 'Bicycles conveyed - subject to reservation',
		teilstreckenHinweis: '(Mainz Hbf - Mannheim Hbf)',
	}, {
		kategorie: 'INFORMATION',
		key: 'CK',
		value: 'Komfort Check-in possible (visit bahn.de/kci for more information)',
		teilstreckenHinweis: '(Mainz Hbf - Mannheim Hbf)',
	}]}};
	const expected = [{
		// "code": "bicycle-conveyance-reservation",
		code: 'FR',
		// "summary": "bicycles conveyed, subject to reservation",
		summary: 'Bicycles conveyed - subject to reservation',
		text: 'Bicycles conveyed - subject to reservation',
		type: 'hint',
	}, {
		// "code": "komfort-checkin",
		code: 'CK',
		// "summary": "Komfort-Checkin available",
		summary: 'Komfort Check-in possible (visit bahn.de/kci for more information)',
		text: 'Komfort Check-in possible (visit bahn.de/kci for more information)',
		type: 'hint',
	}];

	t.same(parse(ctx, input), expected);
	t.end();
});


tap.test('parses board disruptions correctly', (t) => {
	const input = {disruptions: [
		{
			disruptionID: '9aee61d6-700e-3c19-aaa0-019f5612df4c',
			disruptionCommunicationID: null,
			displayPriority: 25,
			descriptions: {
				DE: {
					text: 'Eine Reparatur an einem Signal verzögert den Zugverkehr',
					textShort: 'Verzögerungen durch Reparatur an einem Signal',
				},
			},
		},
	]};
	const expected = [{
		code: undefined,
		summary: 'Verzögerungen durch Reparatur an einem Signal',
		text: 'Eine Reparatur an einem Signal verzögert den Zugverkehr',
		type: 'warning',
	}];

	t.same(parse(ctx, input), expected);
	t.end();
});


tap.test('parses board messages correctly', (t) => {
	const input = {messages: [
		{
			code: '80',
			type: 'QUALITY_VARIATION',
			displayPriority: null,
			category: null,
			text: 'Andere Reihenfolge der Wagen',
			textShort: null,
		},
	]};
	const expected = [{
		code: 80,
		summary: 'Andere Reihenfolge der Wagen',
		text: 'Andere Reihenfolge der Wagen',
		type: 'status',
	}];

	t.same(parse(ctx, input), expected);
	t.end();
});

tap.test('parses ris attributes correctly', (t) => {
	const input = {attributes: [
		{
			displayPriority: null,
			displayPriorityDetail: null,
			code: 'CK',
			text: 'Komfort Check-in verfügbar - wenn möglich bitte einchecken',
			textShort: null,
		},
	]};
	const expected = [{
		// "code": "komfort-checkin",
		code: 'CK',
		// "summary": "Komfort-Checkin available",
		summary: 'Komfort Check-in verfügbar - wenn möglich bitte einchecken',
		text: 'Komfort Check-in verfügbar - wenn möglich bitte einchecken',
		type: 'hint',
	}];

	t.same(parse(ctx, input), expected);
	t.end();
});

tap.test('parses dbnav attributes correctly', (t) => {
	const input = {
		echtzeitNotizen: [{text: 'Halt entfällt'}],
		himNotizen: [{text: 'Coach 27 is closed to passengers today.', prio: 'NORMAL', ueberschrift: 'Information.', letzteAktualisierung: '2024-12-16T08:35:53+00:00'}],
		attributNotizen: [{text: 'Komfort Check-in possible (visit bahn.de/kci for more information)', key: 'CK', priority: 200}, {text: 'DB Fernverkehr AG', key: 'OP'}],
	};
	const expected = [
		{
			code: undefined,
			summary: 'Halt entfällt',
			text: 'Halt entfällt',
			type: 'warning',
		},
		{
			code: undefined,
			summary: 'Information.',
			text: 'Coach 27 is closed to passengers today.',
			modified: '2024-12-16T09:35:53+01:00',
			type: 'status',
		},
		{
			code: 'CK',
			summary: 'Komfort Check-in possible (visit bahn.de/kci for more information)',
			text: 'Komfort Check-in possible (visit bahn.de/kci for more information)',
			type: 'hint',
			priority: 200,
		},
	];

	t.same(parse(ctx, input), expected);
	t.end();
});

tap.test('parses dbnav ruf attributes correctly', (t) => {
	const input = {
		attributNotizen: [{text: 'Tel. 0981-9714925, Anmeldung bis 90 Min. vor Abfahrt (Mo-So: 9-15 Uhr)', key: 'cB', priority: 1}],
	};
	const expected = [
		{
			code: 'cB',
			summary: 'Tel. 0981-9714925, Anmeldung bis 90 Min. vor Abfahrt (Mo-So: 9-15 Uhr)',
			text: 'Tel. 0981-9714925, Anmeldung bis 90 Min. vor Abfahrt (Mo-So: 9-15 Uhr)',
			type: 'warning',
			priority: 1,
		},
	];

	t.same(parse(ctx, input), expected);
	t.end();
});

