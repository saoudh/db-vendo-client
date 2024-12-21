const formatLocationFilter = (stops, addresses, poi) => {
	if (stops && addresses && poi) {
		return ['ALL'];
	}
	const types = [];
	if (stops) {
		types.push('ST');
	}
	if (addresses) {
		types.push('ADR');
	}
	if (poi) {
		types.push('POI');
	}
	return types;
};

export {
	formatLocationFilter,
};
