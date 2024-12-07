import isObj from 'lodash/isObject.js';

const hasProp = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

const formatProductsFilter = (ctx, filter) => {
	if (!isObj(filter)) {
		throw new TypeError('products filter must be an object');
	}
	const {profile} = ctx;

	const byProduct = {};
	const defaultProducts = {};
	for (let product of profile.products) {
		byProduct[product.id] = product;
		defaultProducts[product.id] = product.default;
	}
	filter = Object.assign({}, defaultProducts, filter);

	let products = [];
	for (let product in filter) {
		if (!hasProp(filter, product) || filter[product] !== true) {
			continue;
		}
		if (!byProduct[product]) {
			throw new TypeError('unknown product ' + product);
		}
		products.push(byProduct[product].vendo);
	}
	if (products.length === 0) {
		throw new Error('no products used');
	}

	return products;
};

export {
	formatProductsFilter,
};
