import tap from 'tap';
import {formatProductsFilter as format} from '../../format/products-filter.js';

const products = [
	{
		id: 'train',
		bitmasks: [1, 2],
		vendo: 'REGIONAL',
		default: true,
	},
	{
		id: 'bus',
		bitmasks: [4],
		vendo: 'BUS',
		default: true,
	},
	{
		id: 'tram',
		bitmasks: [8, 32],
		vendo: 'TRAM',
		default: false,
	},
];

const ctx = {
	common: {},
	opt: {},
	profile: {products},
};

tap.test('formatProductsFilter works without customisations', (t) => {
	const expected = ['REGIONAL', 'BUS'];
	const filter = {};
	t.same(format(ctx, filter), expected);
	t.end();
});