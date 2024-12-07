import tap from 'tap';
import {parseRemarks as parse} from '../../parse/remarks.js';
import { parseDateTime } from '../../parse/date-time.js';

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
        "code": "MDA-AK-MSG-1000",
        "nachrichtKurz": "Connection is in the past.",
        "nachrichtLang": "Selected connection is in the past.",
        "fahrtRichtungKennzeichen": "HINFAHRT"
    }]};
	const expected = [{
        "code": "MDA-AK-MSG-1000",
        "summary": "Connection is in the past.",
        "text": "Selected connection is in the past.",
        "type": "hint"
    }];

	t.same(parse(ctx, input), expected);
	t.end();
});

tap.test('parses risNotizen correctly', (t) => {
	const input = {risNotizen: [{key: "FT", value: "Staff delayed due to earlier journey", routeIdxFrom: 0, routeIdxTo: 12}]};
	const expected = [{
        "code": "FT",
        "summary": "Staff delayed due to earlier journey",
        "text": "Staff delayed due to earlier journey",
        "type": "warning"
    }];

	t.same(parse(ctx, input), expected);
	t.end();
});

tap.test('parses low Prio him himMeldungen correctly', (t) => {
	const input = {himMeldungen: [{
        "ueberschrift": "Construction work.",
        "text": "Advance notice! In the period from 15.12.24 to 17.01.25, construction work will take place",
        "prioritaet": "NIEDRIG",
        "modDateTime": "2024-12-03T12:52:29"
    }]};
	const expected = [{
        "code": undefined,
        "summary": "Construction work.",
        "text": "Advance notice! In the period from 15.12.24 to 17.01.25, construction work will take place",
        "type": "status",
		"modified": "2024-12-03T12:52:29+01:00"
    }];

	t.same(parse(ctx, input), expected);
	t.end();
});

tap.test('parses high Prio him himMeldungen correctly', (t) => {
	const input = {himMeldungen: [{
        "ueberschrift": "Disruption.",
        "text": "Switch repairs between Frankfurt(Main)Hbf and Mannheim Hbf delays rail transport.",
        "prioritaet": "HOCH",
        "modDateTime": "2024-12-05T19:01:48"
    }]};
	const expected = [{
        "code": undefined,
        "summary": "Disruption.",
        "text": "Switch repairs between Frankfurt(Main)Hbf and Mannheim Hbf delays rail transport.",
        "type": "warning",
		"modified": "2024-12-05T19:01:48+01:00"
    }];

	t.same(parse(ctx, input), expected);
	t.end();
});

tap.test('parses zugattribute correctly', (t) => {
	const input = {verkehrsmittel: {zugattribute: [{
        "kategorie": "BEFÖRDERER",
        "key": "BEF",
        "value": "DB Fernverkehr AG"
    },{
        "kategorie": "FAHRRADMITNAHME",
        "key": "FR",
        "value": "Bicycles conveyed - subject to reservation",
        "teilstreckenHinweis": "(Mainz Hbf - Mannheim Hbf)"
    }, {
        "kategorie": "INFORMATION",
        "key": "CK",
        "value": "Komfort Check-in possible (visit bahn.de/kci for more information)",
        "teilstreckenHinweis": "(Mainz Hbf - Mannheim Hbf)"
    }]}};
	const expected = [{
        //"code": "bicycle-conveyance-reservation",
		"code": "FR",
        //"summary": "bicycles conveyed, subject to reservation",
        "summary": "Bicycles conveyed - subject to reservation",
        "text": "Bicycles conveyed - subject to reservation",
        "type": "hint",
    },{
        //"code": "komfort-checkin",
		"code": "CK",
        //"summary": "Komfort-Checkin available",
        "summary": "Komfort Check-in possible (visit bahn.de/kci for more information)",
        "text": "Komfort Check-in possible (visit bahn.de/kci for more information)",
        "type": "hint",
    }];

	t.same(parse(ctx, input), expected);
	t.end();
});
