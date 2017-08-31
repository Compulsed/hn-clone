const BbPromise = require('bluebird');

import Link from '../model/Link';

import * as linkRepository from './link-service';
import * as userRepository from './user-service';

export const getUserLinks = async (userId): Promise<Array<Link>> => {
    return BbPromise.resolve([null]);
}

export const postUserLink = async (userId, link) => {

}