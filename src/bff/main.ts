import { graphql, buildSchema } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import * as _ from 'lodash';
import * as link from './link';
import * as author from './author';

const typeDefs = `
  type Link {
    linkId: String!
    authorId: String!
    title: String!
    author: Author!
  }

  type Author {
    authorId: String!
    name: String!
  }

  type Query {
    link(linkId: ID!): Link!
    author(authorId: ID!): Author!
  }
`;


const resolvers = {
  Link: {
    author: ({ authorId }) => author.authorsById[authorId]
  },

  Query: {
    link: ($, { linkId }) => link.linksById[linkId],
    author: ($, { authorId }) => author.authorsById[authorId]
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});   

module.exports.handler = async (event, context, cb) => {
    const query = `
      query {
        author(authorId: "1") {
          authorId
          name
        }
        link(linkId: "1") {
          linkId
          authorId
          title
          author {
            authorId
            name
          }
        }
      }
    `;
    
    // Run the GraphQL query '{ hello }' and print out the response
    const response = await graphql(schema, query);

    cb(null, response);
}