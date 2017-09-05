import 'source-map-support/register'
import { graphql, buildSchema } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import * as _ from 'lodash';
import * as now from 'performance-now';
import * as DataLoader from 'dataloader';

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

  const userLoader = new DataLoader(
    userIds => lambdaInvoker('get-users', { userIds })
  );
  
  const linkLoader = new DataLoader(
    linkIds => lambdaInvoker('get-links', { linkIds })
  );
  
  const linksByAuthorIdsLoader = new DataLoader(
    authorIds => lambdaInvoker('get-links-by-author-ids', { authorIds })
  );
  
  const resolvers = {
    Link: {
      author: ({ authorId }) => userLoader.load(authorId),
    },
  
    Author: {
      links: ({ userId }) => linksByAuthorIdsLoader.load(userId),
    },
  
    Query: {
      link: (_, { linkId }) => linkLoader.load(linkId),
  
      author: (_, { userId }) => userLoader.load(userId),
    },
  };
  
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

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