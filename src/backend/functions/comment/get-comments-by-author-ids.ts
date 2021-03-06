import 'source-map-support/register'

import * as commentService from '../../service/comment-service'; 

export const handler = async (event, context, cb) => {
    console.log('Event: ', JSON.stringify(event, null, 2));

    return commentService.getCommentsByAuthorIds(event.authorIds)
        .then(comments => cb(null, comments))
        .catch(err => console.error(err.stack) || cb(err));
}