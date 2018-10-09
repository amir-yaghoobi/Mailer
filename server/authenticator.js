
module.exports = (app) => {
	const {config} = app

	function authenticator(req, res, next) {
		const {access_token} = req.headers
		const config_token = config.get('access_token')
		req.log.debug('Perform authentication on request')
		if (config_token === access_token) {
			req.log.debug('Request contain a valid access_token')
			return next()
		}

		req.log.warn(`Attempt to access api without a valid access_token from ip: ${req.ip}`)
		const err = new Error('Authentication required')
		err.status = 401
		return next(err)
	}

	return authenticator
}
