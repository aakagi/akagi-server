'use strict' // eslint-disable-line strict

import { makeExecutableSchema } from 'graphql-tools'
import { graphqlLambda, graphiqlLambda } from 'apollo-server-lambda'
import { schema } from './schema'
import { resolvers } from './resolvers'
import {
  fbMessengerWebhookHandler,
  akagiContactFormHandler,
} from './rest'

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

  const handler = graphqlLambda({ schema: myGraphQLSchema })
  return handler(event, context, callbackFilter)
}

// for local endpointURL is /graphql and for prod it is /stage/graphql
exports.graphiqlHandler = graphiqlLambda({
  endpointURL: process.env.GRAPHQL_ENDPOINT
    ? process.env.GRAPHQL_ENDPOINT
    : '/production/graphql',
})

// Rest API
exports.fbMessengerWebhookHandler = fbMessengerWebhookHandler
exports.akagiContactFormHandler = akagiContactFormHandler
