import slugg from 'slugg';

const parseOperator = (ctx, zugattrib) => {
	if (zugattrib?.operatorName) {
		return {
			type: 'operator',
			id: zugattrib.operatorCode,
			name: zugattrib.operatorName,
		};
	}
	if (!zugattrib || !Array.isArray(zugattrib)) {
		return null;
	}
	const bef = zugattrib.find(z => z.key == 'BEF' || z.key == 'OP');
	if (!bef) {
		return null;
	}
	const name = bef.value || bef.text;
	if (!name) {
		return null;
	}
	return {
		type: 'operator',
		id: slugg(name.trim()), // todo: find a more reliable way
		name,
	};
};

export {
	parseOperator,
};
