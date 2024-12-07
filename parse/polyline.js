import maxBy from 'lodash/maxBy.js';

const parsePolyline = (ctx, p) => { // p = raw polylineGroup
	if (p.polylineDescriptions.length < 1) {
		return null;
	}
	const points = maxBy(p.polylineDescriptions, d => d.coordinates.length).coordinates; // TODO initial and final poly?
	if (points.length === 0) {
		return null;
	}

	const res = points.map(ll => ({
		type: 'Feature',
		properties: {},
		geometry: {
			type: 'Point',
			coordinates: [ll.lng, ll.lat],
		},
	}));

	// TODO initial and final descriptions?, match station info?

	return {
		type: 'FeatureCollection',
		features: res,
	};
};

export {
	parsePolyline,
};
