import 'source-map-support/register'
import { graphql, buildSchema } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import * as _ from 'lodash';
import * as now from 'performance-now';

import lambdaInvoker from './lambdaInvoker';

const typeDefs = `
  type Link {
    linkId: String!
    authorId: String!
    title: String!
    author: Author!
  }

  type Author {
    userId: String!
    name: String!
    links: [Link!]!
  }

  type Query {
    link(linkId: ID!): Link!
    author(userId: ID!): Author!
  }
`; 

const resolvers = {
  Link: {
    author: ({ authorId }) => lambdaInvoker(
      'get-user',
      { userId: authorId }
    ),
  },

  Author: {
    links: ({ authorId }) => lambdaInvoker(
      'get-link-by-author-id',
      { userId: authorId }
    ),
  },

  Query: {
    link: (_, { linkId }) => lambdaInvoker(
      'get-link',
      { linkId }
    ),

    author: (_, { userId }) => lambdaInvoker(
      'get-user',
      { userId }
    ),
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});   

const getHeaders = headers => (_.assign({}, {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS,POST',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
}, headers))

const createResponse = (code, body, headers = {}) => ({
    statusCode: code,
    headers: _.assign(
        {},
        getHeaders(headers),
        headers
    ),
    body: JSON.stringify(body),
});

export const handler = async (event, context, cb) => {
  console.log(event);

  try {
    const { query, variables } = JSON.parse(event.body);
    
    const start = now();
    
    const response = await graphql(
      schema,
      query,
      null,
      {},
      variables
    );

    console.log(` - Duration: ${(now() - start)}`);
    console.log(JSON.stringify(response, null, 2));

    cb(null, createResponse(200, response));
  } catch (err) {
    console.error(err.stack) || createResponse(500, err);
  }
}