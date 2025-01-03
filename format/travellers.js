const formatTravellers = ({profile, opt}) => {
	if ('age' in opt && 'ageGroup' in opt) {
		throw new TypeError(`\
opt.age and opt.ageGroup are mutually exclusive.
Pass in just opt.age, and the age group will calculated automatically.`);
	}

	const tvlrAgeGroup = 'age' in opt
		? profile.ageGroupFromAge(opt.age)
		: opt.ageGroup;

	const basicCtrfReq = {
		klasse: opt.firstClass === true ? 'KLASSE_1' : 'KLASSE_2',
		// todo [breaking]: support multiple travelers
		reisende: [{
			typ: profile.ageGroupLabel[tvlrAgeGroup || profile.ageGroup.ADULT],
			anzahl: 1,
			alter: 'age' in opt
				? [String(opt.age)]
				: [],
			ermaessigungen: [profile.formatLoyaltyCard(opt.loyaltyCard)],
		}],
	};
	return basicCtrfReq;
};

export {
	formatTravellers,
};
