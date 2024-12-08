const parseBitmask = ({profile}, bitmask) => {
	const res = {};
	for (let product of profile.products) {
		res[product.id] = Boolean(bitmask.find(p => p == product.vendo));
	}
	return res;
};

export {
	parseBitmask,
};
