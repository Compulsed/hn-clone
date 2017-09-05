
import 'source-map-support/register'

import * as linkService from '../../service/link-service'; 

export const handler = async (event, context, cb) => {
    console.log('Event: ', JSON.stringify(event, null, 2));

    return linkService.getLinkByAuthorId(event.authorId)
        .then(links => cb(null, links))
        .catch(err => console.error(err.stack) || cb(err));
}