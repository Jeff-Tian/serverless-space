import {startGraphQLServer} from "gatsby-recipes"
import * as path from "path"

console.log('starting gatsby graphql server...')

const directory = path.resolve('.')
startGraphQLServer({directory}, true)

console.log('exiting...')
