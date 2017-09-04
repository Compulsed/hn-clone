import 'source-map-support/register'

import * as linkService from '../../service/link-service'; 

export const handler = async (event, context, cb) =>
    linkService.getLink(event.linkId || 'cc52f016-1492-49d8-9645-b40e0eec2258')
        .then(link => cb(null, link))
        .catch(err => console.error(err.stack) || cb(err));