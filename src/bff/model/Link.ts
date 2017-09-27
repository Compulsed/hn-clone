import * as DataLoader from 'dataloader';
import * as _ from 'lodash';

import { Author } from './Author';
import lambdaInvoker from '../lambdaInvoker';

export const Link = `
    type Link {
        linkId: String!
        authorId: String!
        title: String!
        author: Author!
    }
`;  

const linksByAuthorIdsLoader = new DataLoader(
    authorIds => lambdaInvoker('get-links-by-author-ids', { authorIds })
);

const userLoader = new DataLoader(
    userIds => lambdaInvoker('get-users', { userIds })
);
  
export const Resolvers = {
    Author: {
        links: ({ userId }) => linksByAuthorIdsLoader.load(userId),
    },

    Query: {
        author: (_, { userId }) => userLoader.load(userId),
    },
};

export const LinkType = () => [Link, Author];