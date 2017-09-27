import * as commentsRepository from '../repository/comment-repository';

const uuid = require('uuid/v4');

export const getComment = async commentId =>
    commentsRepository.read(commentId);

export const getComments = async commentIds =>
    commentsRepository.commentLoader.loadMany(commentIds);

export const getCommentsByAuthorId = async authorId =>
    commentsRepository.readByAuthorId(authorId);

export const getCommentsByAuthorIds = async authorIds =>
    commentsRepository.commentsByAuthorIdsLoader.loadMany(authorIds);

export const getCommentsByLinkIds = async linkIds =>
    commentsRepository.commentsByLinkIdsLoader.loadMany(linkIds);