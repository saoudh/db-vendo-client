import slugg from 'slugg';

const parseLine = (ctx, p) => {
	const profile = ctx.profile;
	const res = {
		type: 'line',
		id: slugg(p.verkehrsmittel?.langText || p.transport?.journeyDescription || p.train?.no), // TODO terrible
		fahrtNr: p.verkehrsmittel?.nummer || p.transport?.number || p.train?.no,
		name: p.verkehrsmittel?.name || p.zugName || p.transport?.journeyDescription || p.train && p.train.category + ' ' + p.train.lineName,
		public: true,
	};

	// TODO res.adminCode
	res.productName = p.verkehrsmittel?.kurzText || p.transport?.category || p.train?.category;
	const foundProduct = profile.products.find(pp => pp.vendo == p.verkehrsmittel?.produktGattung || pp.ris == p.transport?.type || pp.ris == p.train?.type);
	res.mode = foundProduct?.mode;
	res.product = foundProduct?.id;

	res.operator = profile.parseOperator(ctx, p.verkehrsmittel?.zugattribute || p.zugattribute);
	return res;
};

export {
	parseLine,
};
