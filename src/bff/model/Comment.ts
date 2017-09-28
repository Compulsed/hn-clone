import * as DataLoader from 'dataloader';
import * as _ from 'lodash';

import { Author } from './Author';
import { getLinks, getUsers } from '../lambda';


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
        linkIds => getLinks(linkIds)
    ),
    
    userLoader: new DataLoader(
        userIds => getUsers(userIds)
    ),
});
  
export const Resolvers = {
    Link: {
        author: ({ authorId }, args, { userLoader }) => 
            userLoader.load(authorId),
    },

    Query: {
        comment: (root, { commentId }, { commentLoader }) =>
            linkLoader.load(linkId),
    },
};

export const LinkType = () => [Link];