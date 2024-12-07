import {createClient} from './index.js'
import {profile as dbProfile} from './p/db/index.js'
import {createHafasRestApi as createApi} from 'hafas-rest-api'

const config = {
	hostname: process.env.HOSTNAME || 'localhost',
	port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
	name: "db-vendo-client",
	description: "db-vendo-client",
	homepage: "https://github.com/public-transport/db-vendo-client",
	version: "7",
	docsLink: 'https://github.com/public-transport/db-vendo-client',
	openapiSpec: true,
	logging: true,
	aboutPage: true,
	etags: 'strong',
	csp: `default-src 'none' style-src 'self' 'unsafe-inline' img-src https:`,
}


const vendo = createClient(dbProfile, 'my-hafas-rest-api')
const api = await createApi(vendo, config)

api.listen(3000, (err) => {
	if (err) console.error(err)
})