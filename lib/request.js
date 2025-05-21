import { parse as parseContentType } from 'content-type';
import { Request, fetch } from 'cross-fetch';
import { randomBytes } from 'crypto';
import { stringify } from 'qs';
import { HafasError } from './errors.js';

const proxyAddress = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || null;
const localAddresses = process.env.LOCAL_ADDRESS || null;
const SIMPLE_PROXYING_SERVER_URL = process.env.SIMPLE_PROXYING_SERVER_URL || "http://localhost:5005/simpleProxying";

let getAgent = () => undefined;

const setupProxy = async () => {
	if (proxyAddress && !getAgent()) {
		const a = await import('https-proxy-agent');
		const agent = new a.default.HttpsProxyAgent(proxyAddress, {
			keepAlive: true,
			keepAliveMsecs: 10 * 1000, // 10s
		});
		getAgent = () => agent;
	}
};

const randomBytesHexString = length => [...Array(length)].map(() => Math.floor(Math.random() * 16)
	.toString(16))
	.join('');

const id = randomBytesHexString(6)
	.toString('hex');
const randomizeUserAgent = (userAgent) => {
	let ua = userAgent;
	for (
		let i = Math.round(5 + Math.random() * 5);
		i < ua.length;
		i += Math.round(5 + Math.random() * 5)
	) {
		ua = ua.slice(0, i) + id + ua.slice(i);
		i += id.length;
	}
	return ua;
};

const checkIfResponseIsOk = (_) => {
	const {
		body,
		errProps: baseErrProps,
	} = _;

	const errProps = {
		...baseErrProps,
	};
	if (body.id) {
		errProps.hafasResponseId = body.id;
	}

	// Because we want more accurate stack traces, we don't construct the error here,
	// but only return the constructor & error message.
	const getError = (_) => {
		// mutating here is ugly but pragmatic
		if (_.fehlerNachricht.ueberschrift) {
			errProps.hafasMessage = _.fehlerNachricht.ueberschrift;
		}
		if (_.fehlerNachricht.text) {
			errProps.hafasDescription = _.fehlerNachricht.text;
		}
		return {
			Error: HafasError,
			message: errProps.hafasMessage || 'unknown error',
			props: { code: _.fehlerNachricht.code },
		};
	};

	if (body.fehlerNachricht || body.errors) { // TODO better handling
		const {Error: HafasError, message, props} = getError(body);
		throw new HafasError(message, body.err || body.errors, {...errProps, ...props});
	}
};

const request = async (ctx, userAgent, reqData) => {
	const { profile, opt } = ctx;

	const endpoint = reqData.endpoint;
	delete reqData.endpoint;
	const rawReqBody = profile.transformReqBody(ctx, reqData.body);

	const req = profile.transformReq(ctx, {
		agent: getAgent(),
		keepalive: true,
		method: reqData.method,
		// todo: CORS? referrer policy?
		body: JSON.stringify(rawReqBody),
		headers: {
			'Content-Type': 'application/json', // + ", "+reqData.headers["Content-Type"],
			'Accept-Encoding': 'gzip, br, deflate',
			'Accept': 'application/json', // + ", "+reqData.headers["Accept"],
			'Accept-Language': opt.language || profile.defaultLanguage || 'en',
			'user-agent': profile.randomizeUserAgent
				? randomizeUserAgent(userAgent)
				: userAgent,
			'connection': 'keep-alive', // prevent excessive re-connecting
		},
		redirect: 'follow',
		query: reqData.query,
	});

	const reqId = randomBytes(3)
		.toString('hex');
	let url = SIMPLE_PROXYING_SERVER_URL + "?" + new URLSearchParams({ ...req.query, targetUrl: endpoint + (reqData.path || '') }).toString();
	if (req.query) {
		url += '?' + stringify(req.query, { arrayFormat: 'brackets', encodeValuesOnly: true });
	}
	const fetchReq = new Request(url, req);
	profile.logRequest(ctx, fetchReq, reqId);


	const bodyStr = JSON.stringify({ ...rawReqBody, alternativeHeaders: reqData.headers })


	let res;
	try {
		const controller = new AbortController()
		const signal = controller.signal
		// Setting a timeout of 5 seconds
		setTimeout(() => controller.abort(), 30000)
		res = await fetch(url, {
			signal: signal,
			method: 'POST',
			headers: { ...req.headers }, //, ...{ 'Content-Type': 'application/json' }},
			body: bodyStr
		})
	} catch (e) {
		const err = new Error(e);
		throw err;
	}

	const errProps = {
		// todo [breaking]: assign as non-enumerable property
		request: fetchReq,
		// todo [breaking]: assign as non-enumerable property
		response: res,
		url,
	};

	if (!res.ok) {
		// todo [breaking]: make this a FetchError or a HafasClientError?
		console.log(JSON.stringify(res), await res.text());
		const err = new Error(res.statusText);
		Object.assign(err, errProps);
		throw err;
	}

	let cType = res.headers.get('content-type');
	if (cType) {
		const { type } = parseContentType(cType);
		if (type !== req.headers['Accept']) {
			throw new HafasError('invalid/unsupported response content-type: ' + cType, null, errProps);
		}
	}

	const body = await res.text();
	profile.logResponse(ctx, res, body, reqId);

	const b = JSON.parse(body);
	checkIfResponseIsOk({
		body: b,
		errProps,
	});
	return {
		res: b,
		common: {},
	};
};

export {
	checkIfResponseIsOk,
	request
};

