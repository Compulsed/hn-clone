import * as _ from 'lodash';

export const links = [
    { linkId: 1, authorId: 1, title: 'Hello world!' },
    { linkId: 2, authorId: 1, title: 'Hello world!' },
];

export const linksById = _.keyBy(links, 'linkId');
  
export const linksByAuthorId = _.keyBy(links, 'authorId');
