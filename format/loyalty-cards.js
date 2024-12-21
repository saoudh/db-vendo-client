const c = {
	NONE: Symbol('no loyalty card'),
	BAHNCARD: Symbol('Bahncard'),
	VORTEILSCARD: Symbol('VorteilsCard'),
	HALBTAXABO: Symbol('HalbtaxAbo'),
	VOORDEELURENABO: Symbol('Voordeelurenabo'),
	SHCARD: Symbol('SH-Card'),
	GENERALABONNEMENT: Symbol('General-Abonnement'),
};

// see https://gist.github.com/juliuste/202bb04f450a79f8fa12a2ec3abcd72d
const formatLoyaltyCard = (data) => {
	if (!data) {
		return {
			art: 'KEINE_ERMAESSIGUNG',
			klasse: 'KLASSENLOS',
		};
	}
	const cls = data.class === 1 ? 'KLASSE_1' : 'KLASSE_2';
	if (data.type.toString() === c.BAHNCARD.toString()) {
		return {
			art: 'BAHNCARD' + data.discount,
			klasse: cls,
		};
	}
	if (data.type.toString() === c.VORTEILSCARD.toString()) {
		return {
			art: 'A-VORTEILSCARD',
			klasse: 'KLASSENLOS',
		};
	}
	if (data.type.toString() === c.HALBTAXABO.toString()) {
		return {
			art: 'CH-HALBTAXABO_OHNE_RAILPLUS',
			klasse: 'KLASSENLOS',
		};
	}
	// TODO Rest
	if (data.type.toString() === c.GENERALABONNEMENT.toString()) {
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
