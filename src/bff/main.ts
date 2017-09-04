import 'source-map-support/register'
import { graphql, buildSchema } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';

import * as _ from 'lodash';
import * as link from './link';
import * as author from './author';
import * as lambdaInvoker from './lambdaInvoker';

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
  }

  type Query {
    link(linkId: ID!): Link!
    author(userId: ID!): Author!
  }
`; 

const resolvers = {
  Link: {
    author: ({ authorId }) =>
      lambdaInvoker.invokeLambda('get-user', { userId: authorId }),
  },

  Query: {
    link: (_, { linkId }) =>
      lambdaInvoker.invokeLambda('get-link', { linkId }),
    
    author: (_, { userId }) =>
      lambdaInvoker.invokeLambda('get-user', { userId }),
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});   

export const handler = async (event, context, cb) => {
  console.log(event);

  try {
    const query = `
      query {
        author(userId: "f8f2f266-cfb4-45b5-8db9-ca9d4b5891ba") {
          userId
          name
        }
        link(linkId: "cc52f016-1492-49d8-9645-b40e0eec2258") {
          linkId
          authorId
          title
          author {
            userId
            name
          }
        }
      }
    `;
    
    const response = await graphql(schema, query);

    cb(null, response);
  } catch (err) {
    console.error(err.stack) || cb(err);
  }
}