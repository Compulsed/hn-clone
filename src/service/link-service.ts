import * as linkRepository from '../repository/link-repository';

const uuid = require('uuid/v4');

export const getLink = async userId =>
    linkRepository.read(userId);

export const createLink = async () =>
    linkRepository.create();

export const updateLink = async (userId, updateObject) =>
    linkRepository.update(userId, updateObject);
    
export const deleteLink = async userId =>
    linkRepository.del(userId);