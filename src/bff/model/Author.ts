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

const linkLoader = new DataLoader(
    linkIds => lambdaInvoker('get-links', { linkIds })
);

const userLoader = new DataLoader(
    userIds => lambdaInvoker('get-users', { userIds })
);

export const Resolvers = {
    Link: {
        author: ({ authorId }) => userLoader.load(authorId),
    },

    Query: {
        link: (_, { linkId }) => linkLoader.load(linkId),
    },
};


export const AuthorType = () => [Author, Link];