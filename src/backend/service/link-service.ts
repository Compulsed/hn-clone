import * as linkRepository from '../repository/link-repository';

const uuid = require('uuid/v4');

export const getLink = async userId =>
    linkRepository.read(userId);

export const getLinkByAuthorId = async authorId =>
    linkRepository.readByAuthorId(authorId);

export const createLink = async (linkId, linkCreationObject) =>
    linkRepository.create(linkId, linkCreationObject);

export const updateLink = async (linkId, updateObject) =>
    linkRepository.update(linkId, updateObject);
    
export const deleteLink = async userId =>
    linkRepository.del(userId);