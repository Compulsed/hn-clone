import lambdaInvoker from '../lambdaInvoker';

// Users
export const getUsers = userIds =>
    lambdaInvoker('get-users', { userIds });

// Links
export const getLinks = linkIds =>
    lambdaInvoker('get-links', { linkIds });
export const getLinksByAuthorIds = authorIds =>
    lambdaInvoker('get-links-by-author-ids', { authorIds });

// Comments
export const getComments = commentIds =>
    lambdaInvoker('get-comments', { commentIds });


export const getCommentsByAuthorIds = authorIds =>
    lambdaInvoker('get-comments-by-author-ids', { authorIds });

export const getCommentsByLinkIds = linkIds =>
    lambdaInvoker('get-comments-by-link-ids', { linkIds });
