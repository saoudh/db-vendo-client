const formatJourneysReq = (ctx, query) => {
	query = Object.assign(query, ctx.profile.formatTravellers(ctx));
	return {
		endpoint: ctx.profile.journeysEndpoint,
		body: query,
		method: 'post',
	};
};

const formatRefreshJourneyReq = (ctx, refreshToken) => {
	const {profile} = ctx;
	let query = {
		ctxRecon: refreshToken,
		deutschlandTicketVorhanden: false,
		nurDeutschlandTicketVerbindungen: false,
		reservierungsKontingenteVorhanden: false,
	};
	query = Object.assign(query, profile.formatTravellers(ctx));
	return {
		endpoint: profile.refreshJourneysEndpoint,
		body: query,
		method: 'post',
	};
};

export {
	formatJourneysReq,
	formatRefreshJourneyReq,
};
