const tableName = process.env.commentTable || 'Undefined';

import * as BbPromise from 'bluebird';

const AWS = require('aws-sdk');
const uuid = require('uuid/v4');
const _ = require('lodash');
const DataLoader = require('dataloader');

interface Comment {
    commentId: string
    linkId: string
    authorId: string
    body: string
};

interface CommentCreationObject {
    linkId: string
    authorId: string
    body: string
};

interface CommentUpdateObject {
    body?: string
}

const commentsDb = new AWS.DynamoDB.DocumentClient({
    params: { TableName: tableName },
});

export const commentsByAuthorIdsLoader = new DataLoader(
    authorIds => BbPromise.map(authorIds, readByAuthorId),
    { cache: false }
);

export const commentsByLinkIdsLoader = new DataLoader(
    linkIds => BbPromise.map(linkIds, readByLinkId),
    { cache: false }
);

export const commentLoader = new DataLoader(
    commentIds => batchRead(commentIds),
    { cache: false }
);

const batchRead = async (commentIds: Array<string>) => {
    const params = {
        RequestItems: {
            [tableName]: {
                Keys: commentIds.map(commentId => ({ comment_id: commentId })),
            },
        },
    };

    console.log('batchRead Params: ', JSON.stringify(params, null, 2));
    
    const readResult = await commentsDb
        .batchGet(params)
        .promise();

    console.log('batchRead Result: ', JSON.stringify(readResult, null, 2));        

    return readResult.Responses[tableName].map(toAppModel);
}

export const read = async (commentId: string): Promise<Comment> => {
    const params = {
        Key: { comment_id: commentId }
    }

    console.log('read Params: ', JSON.stringify(params, null, 2));

    const readResult = await commentsDb
        .get(params)
        .promise();

    console.log('read Result: ', JSON.stringify(readResult, null, 2));        

    return toAppModel(readResult.Item);
};

export const readByLinkId = async (linkId: string): Promise<Array<Comment>> => {
    const params = {
        IndexName: 'comments_by_link_id',
        KeyConditionExpression: 'link_id = :hkey',        
        ExpressionAttributeValues: {
            ':hkey': linkId,
        },
    };

    console.log('readByLinkId Params: ', JSON.stringify(params, null, 2));
    
    const readResult = await commentsDb
        .query(params)
        .promise();

    console.log('readByLinkId Result: ', JSON.stringify(readResult, null, 2));

    return readResult
        .Items
        .map(toAppModel);
};

export const readByAuthorId = async (authorId: string): Promise<Array<Comment>> => {
    const params = {
        IndexName: 'comments_by_author_id',
        KeyConditionExpression: 'author_id = :hkey',        
        ExpressionAttributeValues: {
            ':hkey': authorId,
        },
    };

    console.log('readByAuthorId Params: ', JSON.stringify(params, null, 2));
    
    const readResult = await commentsDb
        .query(params)
        .promise();

    console.log('readByAuthorId Result: ', JSON.stringify(readResult, null, 2));

    return readResult
        .Items
        .map(toAppModel);
};


export const create = async (commentId: string, commentCreationObject: CommentCreationObject): Promise<Comment> => {
    const item = { 
        commentId: commentId,
        linkId: commentCreationObject.linkId,        
        authorId: commentCreationObject.authorId,
        body: commentCreationObject.body,
    };

    const params = {
        Item: toDbModel(item),
    };

    // Returns empty object
    const putResult = await commentsDb
        .put(params)
        .promise();

    return item;
};

export const update = async (commentId: string, commentUpdateObject: CommentUpdateObject): Promise<Comment> => {
    const attributeUpdates = _(commentUpdateObject)
        .thru(toDbModel)
        .pickBy()
        .mapValues(property => ({ Action: 'PUT', Value: property }))
        .value();

        
    const params = {
        Key: { comment_id: commentId },
        AttributeUpdates: attributeUpdates,
        ReturnValues: 'ALL_NEW',
    };
        
    console.log('Update Params: ', JSON.stringify(params, null, 2));

    // Returns, updated link
    const updateResult = await commentsDb
        .update(params)
        .promise();

    return toAppModel(updateResult.Attributes);
};

export const del = async (commentId: string): Promise<Comment>  => {
    const params = {
        Key: { comment_id: commentId },
        ReturnValues: 'ALL_OLD',
    }

    // Returns, old object
    const deletedRecord = await commentsDb
        .delete(params)
        .promise();

    return toAppModel(deletedRecord.Attributes);
};

const toDbModel = (comment: Comment) => ({
    comment_id: comment.commentId,
    link_id: comment.commentId,
    author_id: comment.authorId,
    body: comment.body,
});

const toAppModel = (comment): Comment => ({
    commentId: comment.comment_id,
    linkId: comment.link_id,
    authorId: comment.author_id,
    body: comment.body,
});