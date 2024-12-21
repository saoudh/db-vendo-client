
const parsePrice = (ctx, raw) => {
	if (raw.angebotsPreis?.betrag) {
		return {
			amount: raw.angebotsPreis.betrag,
			currency: raw.angebotsPreis.waehrung,
			hint: null,
		};
	}
	return undefined;
};

const parseTickets = (ctx, j) => {
	if (!ctx.opt.tickets) {
		return undefined;
	}
	let tickets = undefined;
	if (j.reiseAngebote && j.reiseAngebote.length > 0) { // if refreshJourney()
		tickets = j.reiseAngebote
			.filter(s => s.typ == 'REISEANGEBOT' && !s.angebotsbeziehungList.flatMap(b => b.referenzen)
				.find(r => r.referenzAngebotsoption == 'PFLICHT'))
			.map((s) => {
				const p = {
					name: s.name,
					priceObj: {
						amount: Math.round(s.preis?.betrag * 100),
						currency: s.preis?.waehrung,
					},
					firstClass: s.klasse == 'KLASSE_1',
					partialFare: s.teilpreis,
				};
				if (s.teilpreis) {
					p.addData = 'Teilpreis / partial fare';
				}
				if (s.konditionsAnzeigen) {
					p.addDataTicketInfo = s.konditionsAnzeigen?.map(a => a.anzeigeUeberschrift)
						.join('. ');
					p.addDataTicketDetails = s.konditionsAnzeigen?.map(a => a.textLang)
						.join(' ');
				}
				if (s.leuchtturmInfo) {
					p.addDataTravelInfo = s.leuchtturmInfo?.text;
				}
				return p;
			});
		if (ctx.opt.generateUnreliableTicketUrls) {
			// TODO
		}

	} else if (j.angebotsPreis?.betrag) { // if journeys()
		tickets = [{
			name: 'from',
			priceObj: {
				amount: Math.round(j.angebotsPreis.betrag * 100),
				currency: j.angebotsPreis.waehrung,
			},
		}];
	}
	return tickets;
};

export {
	parsePrice,
	parseTickets,
};
