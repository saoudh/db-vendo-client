import {formatLocationIdentifier} from './location-identifier.js';

const isIBNR = /^\d{6,}$/;

const formatStation = (id) => {
	if (!isIBNR.test(id)) {
		throw new Error('station ID must be an IBNR.');
	}
	return {
		type: 'S', // station
		// todo: name necessary?
		lid: formatLocationIdentifier({
			A: '1', // station?
			L: id,
			// todo: `p` – timestamp of when the ID was obtained
		}),
	};
};

export {
	formatStation,
};
