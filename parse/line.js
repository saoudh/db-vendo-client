import slugg from 'slugg';

const parseLine = (ctx, p) => {
	const profile = ctx.profile;
	const res = {
		type: 'line',
		id: slugg(p.verkehrsmittel?.langText), // TODO terrible
		fahrtNr: p.verkehrsmittel?.nummer,
		name: p.verkehrsmittel?.name  || p.zugName,
		public: true,
	};

	// TODO res.adminCode
	res.productName = p.verkehrsmittel?.kurzText;
	const foundProduct = profile.products.find(pp => pp.vendo == p.verkehrsmittel?.produktGattung)
	res.mode = foundProduct?.mode;
	res.product = foundProduct?.id;

	res.operator = profile.parseOperator(ctx, p.verkehrsmittel?.zugattribute || p.zugattribute);
	return res;
};

export {
	parseLine,
};
