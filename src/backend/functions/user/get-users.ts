import 'source-map-support/register'

import * as userService from '../../service/user-service'; 

export const handler = async (event, context, cb) => {
    console.log('Event: ', JSON.stringify(event, null, 2));

    return userService.getUsers(event.userIds)
        .then(users => cb(null, users))
        .catch(err => console.error(err.stack) || cb(err));
}