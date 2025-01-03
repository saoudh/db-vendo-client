
// todo:
// [ { type: 'hint',
//     code: 'P5',
//     text: 'Es gilt ein besonderer Fahrpreis' }
const hintsByCode = Object.assign(Object.create(null), {
	fb: {
		type: 'hint',
		code: 'bicycle-conveyance',
		summary: 'bicycles conveyed',
	},
	fr: {
		type: 'hint',
		code: 'bicycle-conveyance-reservation',
		summary: 'bicycles conveyed, subject to reservation',
	},
	nf: {
		type: 'hint',
		code: 'no-bicycle-conveyance',
		summary: 'bicycles not conveyed',
	},
	k2: {
		type: 'hint',
		code: '2nd-class-only',
		summary: '2. class only',
	},
	eh: {
		type: 'hint',
		code: 'boarding-ramp',
		summary: 'vehicle-mounted boarding ramp available',
	},
	ro: {
		type: 'hint',
		code: 'wheelchairs-space',
		summary: 'space for wheelchairs',
	},
	oa: {
		type: 'hint',
		code: 'wheelchairs-space-reservation',
		summary: 'space for wheelchairs, subject to reservation',
	},
	wv: {
		type: 'hint',
		code: 'wifi',
		summary: 'WiFi available',
	},
	wi: {
		type: 'hint',
		code: 'wifi',
		summary: 'WiFi available',
	},
	sn: {
		type: 'hint',
		code: 'snacks',
		summary: 'snacks available for purchase',
	},
	mb: {
		type: 'hint',
		code: 'snacks',
		summary: 'snacks available for purchase',
	},
	mp: {
		type: 'hint',
		code: 'snacks',
		summary: 'snacks available for purchase at the seat',
	},
	bf: {
		type: 'hint',
		code: 'barrier-free',
		summary: 'barrier-free',
	},
	rg: {
		type: 'hint',
		code: 'barrier-free-vehicle',
		summary: 'barrier-free vehicle',
	},
	bt: {
		type: 'hint',
		code: 'on-board-bistro',
		summary: 'Bordbistro available',
	},
	br: {
		type: 'hint',
		code: 'on-board-restaurant',
		summary: 'Bordrestaurant available',
	},
	ki: {
		type: 'hint',
		code: 'childrens-area',
		summary: 'children\'s area available',
	},
	kk: {
		type: 'hint',
		code: 'parents-childrens-compartment',
		summary: 'parent-and-children compartment available',
	},
	kr: {
		type: 'hint',
		code: 'kids-service',
		summary: 'DB Kids Service available',
	},
	ls: {
		type: 'hint',
		code: 'power-sockets',
		summary: 'power sockets available',
	},
	ev: {
		type: 'hint',
		code: 'replacement-service',
		summary: 'replacement service',
	},
	kl: {
		type: 'hint',
		code: 'air-conditioned',
		summary: 'air-conditioned vehicle',
	},
	r0: {
		type: 'hint',
		code: 'upward-escalator',
		summary: 'upward escalator',
	},
	au: {
		type: 'hint',
		code: 'elevator',
		summary: 'elevator available',
	},
	ck: {
		type: 'hint',
		code: 'komfort-checkin',
		summary: 'Komfort-Checkin available',
	},
	it: {
		type: 'hint',
		code: 'ice-sprinter',
		summary: 'ICE Sprinter service',
	},
	rp: {
		type: 'hint',
		code: 'compulsory-reservation',
		summary: 'compulsory seat reservation',
	},
	rm: {
		type: 'hint',
		code: 'optional-reservation',
		summary: 'optional seat reservation',
	},
	scl: {
		type: 'hint',
		code: 'all-2nd-class-seats-reserved',
		summary: 'all 2nd class seats reserved',
	},
	acl: {
		type: 'hint',
		code: 'all-seats-reserved',
		summary: 'all seats reserved',
	},
	sk: {
		type: 'hint',
		code: 'oversize-luggage-forbidden',
		summary: 'oversize luggage not allowed',
	},
	hu: {
		type: 'hint',
		code: 'animals-forbidden',
		summary: 'animals not allowed, except guide dogs',
	},
	ik: {
		type: 'hint',
		code: 'baby-cot-required',
		summary: 'baby cot/child seat required',
	},
	ee: {
		type: 'hint',
		code: 'on-board-entertainment',
		summary: 'on-board entertainment available',
	},
	toilet: {
		type: 'hint',
		code: 'toilet',
		summary: 'toilet available',
	},
	oc: {
		type: 'hint',
		code: 'wheelchair-accessible-toilet',
		summary: 'wheelchair-accessible toilet available',
	},
	iz: {
		type: 'hint',
		code: 'intercity-2',
		summary: 'Intercity 2',
	},
});

const parseHintByCode = (raw) => {
	const hint = hintsByCode[raw.key.trim()
		.toLowerCase()];
	if (hint) {
		return Object.assign({text: raw.value || raw.text}, hint);
	}
	return null;
};

export {
	hintsByCode,
	parseHintByCode,
};
