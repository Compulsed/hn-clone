const tableName = process.env.linkTable || 'Undefined';

import * as BbPromise from 'bluebird';

const AWS = require('aws-sdk');
const uuid = require('uuid/v4');
const _ = require('lodash');
const DataLoader = require('dataloader');

interface Link {
    linkId: string,
    authorId: string,
    title: string,
};

interface LinkCreationObject {
    authorId: string,
    title: string,
};

interface LinkUpdateObject {
    authorId: string,
    title: string,
}

const linksDB = new AWS.DynamoDB.DocumentClient({
    params: { TableName: tableName },
});

export const linksByAuthorIdsLoader = new DataLoader(
    authorIds => BbPromise.map(authorIds, readByAuthorId)
);

export const linkLoader = new DataLoader(
    linkIds => batchRead(linkIds)
);

const batchRead = async (linkIds: Array<string>) => {
    const params = {
        RequestItems: {
            [tableName]: {
                Keys: linkIds.map(linkId => ({ link_id: linkId })),
            },
        },
    };

    console.log('batchRead Params: ', JSON.stringify(params, null, 2));
    
    const readResult = await linksDB
        .batchGet(params)
        .promise();

    console.log('batchRead Result: ', JSON.stringify(readResult, null, 2));        

    return readResult.Responses[tableName].map(toAppModel);
}

export const read = async (linkId: string): Promise<Link> => {
    const params = {
        Key: { link_id: linkId }
    }

    console.log('read Params: ', JSON.stringify(params, null, 2));

    const readResult = await linksDB
        .get(params)
        .promise();

    console.log('read Result: ', JSON.stringify(readResult, null, 2));        

    return toAppModel(readResult.Item);
};

export const readByAuthorId = async (authorId: string): Promise<Array<Link>> => {
    const params = {
        IndexName: 'link_by_author_id_index',
        KeyConditionExpression: 'author_id = :hkey',        
        ExpressionAttributeValues: {
            ':hkey': authorId,
        },
    };

    console.log('readByAuthorId Params: ', JSON.stringify(params, null, 2));
    
    const readResult = await linksDB
        .query(params)
        .promise();

    console.log('readByAuthorId Result: ', JSON.stringify(readResult, null, 2));

    return readResult
        .Items
        .map(toAppModel);
};


export const create = async (linkId, linkCreationObject: LinkCreationObject): Promise<Link> => {
    const item = { 
        linkId: linkId,
        authorId: linkCreationObject.authorId,
        title: linkCreationObject.title,
    };

    const params = {
        Item: toDbModel(item),
    };

    // Returns empty object
    const putResult = await linksDB
        .put(params)
        .promise();

    return item;
};

export const update = async (linkId: string, linkUpdateObject: LinkUpdateObject): Promise<Link> => {
    const attributeUpdates = _(linkUpdateObject)
        .thru(toDbModel)
        .pickBy()
        .mapValues(property => ({ Action: 'PUT', Value: property }))
        .value();

        
    const params = {
        Key: { link_id: linkId },
        AttributeUpdates: attributeUpdates,
        ReturnValues: 'ALL_NEW',
    };
        
    console.log('Update Params: ', JSON.stringify(params, null, 2));

    // Returns, updated link
    const updateResult = await linksDB
        .update(params)
        .promise();

    return toAppModel(updateResult.Attributes);
};

export const del = async (linkId: string): Promise<Link>  => {
    const params = {
        Key: { link_id: linkId },
        ReturnValues: 'ALL_OLD',
    }

    // Returns, old object
    const deletedRecord = await linksDB
        .delete(params)
        .promise();

    return toAppModel(deletedRecord.Attributes);
};

const toDbModel = link => ({
    link_id: link.linkId,
    author_id: link.authorId,
    title: link.title,
});

const toAppModel = (link): Link => ({
    linkId: link.link_id,
    authorId: link.author_id,
    title: link.title,
});