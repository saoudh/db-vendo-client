import slugg from 'slugg';

const parseOperator = (ctx, zugattrib) => {
	if (!zugattrib) {
		return null;
	}
	const bef = zugattrib.find(z => z.key == 'BEF');
	if (!bef) {
		return null;
	}
	const name = bef.value && bef.value.trim();
	if (!name) {
		return null;
	}
	return {
		type: 'operator',
		id: slugg(name), // todo: find a more reliable way
		name,
	};
};

export {
	parseOperator,
};
