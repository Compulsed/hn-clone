import 'source-map-support/register'

import * as userService from '../../service/user-service'; 

export const handler = async (event, context, cb) => {
    console.log('Event: ', JSON.stringify(event, null, 2));

    return userService.getUser(event.userId)
        .then(user => cb(null, user))
        .catch(err => console.error(err.stack) || cb(err));
}