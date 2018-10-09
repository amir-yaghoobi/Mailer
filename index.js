const config     = require('config')
const helmet     = require('fastify-helmet')
const fastify    = require('fastify')({
	logger: true
})

fastify.register(helmet)

const app = {
	config,
	fastify
}

app.authMiddleware = require('./server/authenticator')(app)
const emailRoute = require('./server/mailer')(app)

fastify.route(emailRoute)

fastify.listen(config.get('port'), (err, address) => {
	if (err) {
		fastify.log.error('Mailer API cannot start! error:', err)
		return process.exit(-1)
	}
	fastify.log.info(`Mailer API running on ${address}`)
})