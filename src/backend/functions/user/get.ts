import 'source-map-support/register'

import * as userService from '../../service/user-service'; 

export const handler = async (event, context, cb) =>
    userService.getUser(event.userId || 'f8f2f266-cfb4-45b5-8db9-ca9d4b5891ba')
        .then(user => cb(null, user))
        .catch(err => console.error(err.stack) || cb(err));