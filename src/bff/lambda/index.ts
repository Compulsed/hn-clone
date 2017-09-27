import lambdaInvoker from '../lambdaInvoker';

export const getLinksByAuthorIds = authorIds =>
    lambdaInvoker('get-links-by-author-ids', { authorIds });

export const getUsers = userIds =>
    lambdaInvoker('get-users', { userIds });

export const getLinks = linkIds =>
    lambdaInvoker('get-links', { linkIds });
