// https://www.bahn.de/p/view/service/buchung/auslastungsinformation.shtml
const loadFactors = [];
loadFactors[1] = 'low-to-medium';
loadFactors[2] = 'high';
loadFactors[3] = 'very-high';
loadFactors[4] = 'exceptionally-high';

const parseLoadFactor = (opt, auslastung) => {
	if (!auslastung) {
		return null;
	}
	const cls = opt.firstClass === true
		? 'KLASSE_1'
		: 'KLASSE_2';
	const load = auslastung.find(a => a.klasse === cls)?.stufe;
	return load && loadFactors[load] || null;
};

const parseArrOrDepWithLoadFactor = (ctx, d) => {

	/* const load = parseLoadFactor(opt, d);
	if (load) {
		parsed.loadFactor = load;
	}*/ // TODO
	return undefined;
};

export {
	parseArrOrDepWithLoadFactor,
	parseLoadFactor,
};
