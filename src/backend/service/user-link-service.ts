const BbPromise = require('bluebird');

import * as linkRepository from './link-service';
import * as userRepository from './user-service';

export const getUserLinks = async (userId) => {
    return BbPromise.resolve([null]);
}

export const postUserLink = async (userId, link) => {

}