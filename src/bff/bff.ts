import 'source-map-support/register'

import * as _ from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';
import { graphql, buildSchema } from 'graphql';
import { APIGatewayEvent, Callback, Context } from 'aws-lambda';

import { getHeaders, createResponse } from './util';
import { Loaders as LinkLoaders, LinkType, Resolvers as LinkResolvers } from './model/Link';
import { Loaders as AuthorLoaders, AuthorType, Resolvers as AuthorResolvers } from './model/Author';

import RandomQuery from './test-queries/random';

const RootQuery = `
  type Query {
    link(linkId: ID!): Link!
    author(userId: ID!): Author!
  }
`;

const SchemaDefinition = `
  schema {
    query: Query
  }
`;

export const handler = async (event: APIGatewayEvent, context: Context, cb: Callback) => {
  console.log(event);
  
  try {
    const ctx = _.merge(
      {},
      AuthorLoaders(),
      LinkLoaders(),
    );

    console.log('ctx: ', ctx);

    const schema = makeExecutableSchema({
      typeDefs: [
        SchemaDefinition,
        RootQuery,
        AuthorType,
        LinkType
      ],
      resolvers: _.merge(
        {},
        AuthorResolvers,
        LinkResolvers
      ),
    });

    const { query, variables } = /* RandomQuery; */ JSON.parse(
      event.body || '{}'
    ); 
    
    const response = await graphql(
      schema,
      query,
      null,
      ctx,
      variables
    );

    console.log(JSON.stringify(response, null, 2));

    cb(undefined, createResponse(200, response));
  } catch (err) {
    console.error(err);
    console.error(err.stack)
    
    cb(undefined, createResponse(500, err));
  }
}