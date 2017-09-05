import 'source-map-support/register'

import * as linkService from '../../service/link-service'; 

export const handler = async (event, context, cb) => {
    console.log('Event: ', JSON.stringify(event, null, 2));

    return linkService.getLink(event.linkId)
        .then(link => cb(null, link))
        .catch(err => console.error(err.stack) || cb(err));
}