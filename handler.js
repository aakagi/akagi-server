'use strict' // eslint-disable-line strict

import { makeExecutableSchema } from 'graphql-tools'
import server from 'apollo-server-lambda'
import { schema } from './schema'
import { resolvers } from './resolvers'

const myGraphQLSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
  logger: console,
})

exports.graphqlHandler = function graphqlHandler(event, context, callback) {
  function callbackFilter(error, output) {
    // eslint-disable-next-line no-param-reassign
    output.headers['Access-Control-Allow-Origin'] = '*'
    callback(error, output)
  }

  const handler = server.graphqlLambda({ schema: myGraphQLSchema })
  return handler(event, context, callbackFilter)
}

// for local endpointURL is /graphql and for prod it is /stage/graphql
exports.graphiqlHandler = server.graphiqlLambda({ endpointURL: process.env.GRAPHQL_ENDPOINT ? process.env.GRAPHQL_ENDPOINT : '/production/graphql' })

exports.fbMessengerWebhookHandler = function fbMessengerWebhookHandler(event, context, callback) {
  const queryParams = event.queryStringParameters
  const mode = queryParams['hub.mode']
  const verifyToken = queryParams['hub.verify_token']
  const challenge = queryParams['hub.challenge']

  if (mode === 'subscribe' && verifyToken === process.env.WEBHOOK_VERIFICATION) {
    console.log('Validating webhook')
    callback(null, {
      body: challenge,
    })
  } else {
    console.error('Failed validation. Make sure the validation tokens match.')
    callback(null, {
      status: 403,
    })
  }
}
