import 'source-map-support/register'

import * as userService from '../../service/user-service'; 
import * as lambdaHelpers from '@graphcool/lambda-helpers';

export const handler = lambdaHelpers.runtime(async (event) => {
    console.log('Event: ', JSON.stringify(event, null, 2));

    return await userService.getUsers(event.userIds);
});