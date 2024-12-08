import slugg from 'slugg';

const parseLine = (ctx, p) => {
	const profile = ctx.profile;
	const res = {
		type: 'line',
		id: slugg(p.verkehrsmittel?.langText || p.transport?.journeyDescription), // TODO terrible
		fahrtNr: p.verkehrsmittel?.nummer || p.transport?.number,
		name: p.verkehrsmittel?.name || p.zugName || p.transport?.journeyDescription,
		public: true,
	};

	// TODO res.adminCode
	res.productName = p.verkehrsmittel?.kurzText || p.transport?.category;
	const foundProduct = profile.products.find(pp => pp.vendo == p.verkehrsmittel?.produktGattung || pp.ris == p.transport?.type);
	res.mode = foundProduct?.mode;
	res.product = foundProduct?.id;

	res.operator = profile.parseOperator(ctx, p.verkehrsmittel?.zugattribute || p.zugattribute);
	return res;
};

export {
	parseLine,
};
