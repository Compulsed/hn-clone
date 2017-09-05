
import 'source-map-support/register'

import * as linkService from '../../service/link-service'; 

export const handler = async (event, context, cb) =>
    linkService.getLinkByAuthorId(event.authorId || 'f8f2f266-cfb4-45b5-8db9-ca9d4b5891ba')
        .then(links => cb(null, links))
        .catch(err => console.error(err.stack) || cb(err));