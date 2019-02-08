'use strict'

const retry = require('p-retry')

const request = require('./lib/request')
const createClient = require('.')

const defaultRetryOpts = {
	retries: 3,
	factor: 3,
	minTimeout: 5 * 1000
}

const createClientWithRetry = (profile, userAgent, retryOpts = defaultRetryOpts) => {
	const requestWithRetry = (profile, userAgent, opt, data) => {
		const attempt = () => {
			return request(profile, userAgent, opt, data)
			.catch((err) => {
				if (err.isHafasError) throw err // continue
				if (err.code === 'ENOTFOUND') { // abort
					const abortErr = new retry.AbortError(err)
					Object.assign(abortErr, err)
					throw abortErr
				}
				throw err // continue
			})
		}
		return retry(attempt, retryOpts)
	}

	return createClient(profile, userAgent, requestWithRetry)
}

module.exports = createClientWithRetry
