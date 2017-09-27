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

export const Loaders = () => ({
    linkLoader: new DataLoader(
        linkIds => lambdaInvoker('get-links', { linkIds })
    ),
    
    userLoader: new DataLoader(
        userIds => lambdaInvoker('get-users', { userIds })
    ),
});
  
export const Resolvers = {
    Link: {
        author: ({ authorId }, args, { userLoader }) => 
            userLoader.load(authorId),
    },

    Query: {
        link: (root, { linkId }, { linkLoader }) =>
            linkLoader.load(linkId),
    },
};

export const LinkType = () => [Link];