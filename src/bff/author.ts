import * as _ from 'lodash';

export const authors = [
    { authorId: 1, name: 'Dale!' },
    { authorId: 1, name: 'Eva!' },
];

export const authorsById = _.keyBy(authors, 'authorId');
