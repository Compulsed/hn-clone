import * as linkRepository from '../repository/link-repository';

const uuid = require('uuid/v4');

export const getLink = async linkId =>
    linkRepository.read(linkId);

export const getLinks = async linkIds =>
    linkRepository.linkLoader.loadMany(linkIds);

export const getLinkByAuthorId = async authorId =>
    linkRepository.readByAuthorId(authorId);

export const getLinksByAuthorIds = async authorIds =>
    linkRepository.linksByAuthorIdsLoader.loadMany(authorIds);

export const createLink = async (linkId, linkCreationObject) =>
    linkRepository.create(linkId, linkCreationObject);

export const updateLink = async (linkId, updateObject) =>
    linkRepository.update(linkId, updateObject);
    
export const deleteLink = async linkId =>
    linkRepository.del(linkId);