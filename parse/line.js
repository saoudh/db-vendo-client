import slugg from 'slugg';

const parseLine = (ctx, p) => {
	const profile = ctx.profile;
	const fahrtNr = p.verkehrsmittel?.nummer || p.transport?.number || p.train?.no || p.verkehrsmittelNummer || ((p.mitteltext || '') + ' ').split(' ')[1];
	const res = {
		type: 'line',
		id: slugg(p.verkehrsmittel?.langText || p.transport?.journeyDescription || p.train && p.train.category + ' ' + p.train.lineName + ' ' + p.train.no || p.langtext || p.mitteltext), // TODO terrible
		fahrtNr: String(fahrtNr),
		name: p.verkehrsmittel?.langText || p.verkehrsmittel?.name || p.zugName || p.transport?.journeyDescription || p.train && p.train.category + ' ' + p.train.lineName || p.langtext || p.mitteltext,
		public: true,
	};

	// TODO res.adminCode
	res.productName = p.verkehrsmittel?.kurzText || p.transport?.category || p.train?.category || p.kurztext;
	const foundProduct = profile.products.find(pp => pp.vendo == p.verkehrsmittel?.produktGattung || pp.ris == p.transport?.type || pp.ris == p.train?.type || pp.ris_alt == p.train?.type || pp.dbnav_short == p.produktGattung);
	res.mode = foundProduct?.mode;
	res.product = foundProduct?.id;

	res.operator = profile.parseOperator(ctx, p.verkehrsmittel?.zugattribute || p.zugattribute || p.attributNotizen); // TODO regio-guide op
	return res;
};

export {
	parseLine,
};
