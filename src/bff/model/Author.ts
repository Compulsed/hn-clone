import * as DataLoader from 'dataloader';
import * as _ from 'lodash';

import { Link } from './Link';
import lambdaInvoker from '../lambdaInvoker';

export const Author = `
    type Author {
        userId: String!
        name: String!
        links: [Link!]!
    }
`;

export const Loaders = () => ({
    linksByAuthorIdsLoader: new DataLoader(
        authorIds => lambdaInvoker('get-links-by-author-ids', { authorIds })
    ),
    
    userLoader: new DataLoader(
        userIds => lambdaInvoker('get-users', { userIds })
    ),
});

export const Resolvers = {
    Author: {
        links: ({ userId }, args, { linksByAuthorIdsLoader }) => 
            linksByAuthorIdsLoader.load(userId),
    },

    Query: {
        author: (_, { userId }, { userLoader }) =>
            userLoader.load(userId),
    },
};

export const AuthorType = () => [Author];