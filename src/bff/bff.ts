import 'source-map-support/register'

import { graphql, buildSchema } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import * as _ from 'lodash';

import { AuthorType, Resolvers as AuthorResolver } from './model/Author';
import { LinkType, Resolvers as LinkResolvers } from './model/Link';

const RootQuery = `
  type Query {
    link(linkId: ID!): Link!
    author(userId: ID!): Author!
  }
`;   

const SchemaDefinition = `
  schema {
    query: RootQuery
  }
`;

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
  
  const ctx = {};

  const schema = makeExecutableSchema({
    typeDefs: [
      SchemaDefinition,
      RootQuery,
      AuthorType,
      LinkType
    ],
    resolvers: _.merge(
      AuthorResolver,
      LinkResolvers
    ),
  });

  try {
    const { query, variables } = JSON.parse(event.body);
    
    const response = await graphql(
      schema,
      query,
      null,
      ctx,
      variables
    );

    console.log(JSON.stringify(response, null, 2));

    cb(null, createResponse(200, response));
  } catch (err) {
    console.error(err.stack) || createResponse(500, err);
  }
}