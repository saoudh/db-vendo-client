import {data as c} from 'hafas-client/p/db/loyalty-cards.js'; // TODO remove hafas-client dep?

// see https://gist.github.com/juliuste/202bb04f450a79f8fa12a2ec3abcd72d
const formatLoyaltyCard = (data) => {
	if (!data) {
		return {
			art: 'KEINE_ERMAESSIGUNG',
			klasse: 'KLASSENLOS',
		};
	}
	const cls = data.class === 1 ? 'KLASSE_1' : 'KLASSE_2';
	if (data.type === c.BAHNCARD) {
		return {
			art: 'BAHNCARD' + data.discount,
			klasse: cls,
		};
	}
	if (data.type === c.VORTEILSCARD) {
		return {
			art: 'A-VORTEILSCARD',
			klasse: 'KLASSENLOS',
		};
	}
	if (data.type === c.HALBTAXABO) {
		return {
			art: 'CH-HALBTAXABO_OHNE_RAILPLUS',
			klasse: 'KLASSENLOS',
		};
	}
	// TODO Rest
	if (data.type === c.GENERALABONNEMENT) {
		return {
			art: 'CH-GENERAL-ABONNEMENT',
			klasse: cls,
		};
	}
	return {
		art: 'KEINE_ERMAESSIGUNG',
		klasse: 'KLASSENLOS',
	};
};
export {
	c as data,
	formatLoyaltyCard,
};
