module.exports = (app) => {

	const nodemailer  = require('nodemailer')
	const transporter = nodemailer.createTransport(app.config.get('mailAccount'))

	async function emailSender (req, res) {
		const {from, to, subject, body} = req.body

		return transporter.sendMail({
			from,
			to,
			subject,
			html: body
		}).then(result => {
			/*
					-------------------------------------------------------
					"accepted": [
					  "<email@gmail.com>"
					],
					"rejected": [],
					"envelopeTime": 602,
					"messageTime": 648,
					"messageSize": 289,
					"response": "250 Great success",
					"envelope": {
					    "from": "<sub@ourdomain.com>",
					    "to": [
					        "<email@gmail.com>"
					    ]
					},
					"messageId": "<messageId>"
					------------------------------------------------------------------
			 */
			// TODO parse rejected : if there is any attempt to resend
			// TODO parse network errors (timeout, etc...) and provide failover mechanism
			return result
		}).catch(err => {
			req.log.warn('Cannot send email from: %s to: %s, error: %s', from, to, err)
			err.status = 500
			return err
		})
	}

	const emailRoute = {
		method: 'POST',
		url: '/email',
		handler: emailSender,
		beforeHandler: app.authMiddleware,
		schema: {
			body: {
				type: 'object',
				properties: {
					from: { type: 'string' },
					to: { type: 'string' },
					subject: { type: 'string' },
					body: { type: 'string' },
				},
				required: ['from', 'to', 'subject', 'body']
			},
			headers: {
				type: 'object',
				properties: {
					'access_token': { type: 'string' }
				},
				required: ['access_token']
			}
		}
	}


	return emailRoute
}
