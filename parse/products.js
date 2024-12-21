const parseProducts = ({profile}, products) => {
	const res = {};
	for (let product of profile.products) {
		res[product.id] = Boolean(products.find(p => p == product.vendo || p == product.dbnav));
	}
	return res;
};

export {
	parseProducts,
};
