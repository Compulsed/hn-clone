const tableName = process.env.linkTable;

const AWS = require('aws-sdk');
const uuid = require('uuid/v4');
const _ = require('lodash');

interface Link {
    linkId: string,
    payload: string,
};

const linksDB = new AWS.DynamoDB.DocumentClient({
    params: { TableName: tableName },
});

export const create = async (): Promise<Link> => {
    const item = { 
        linkId: uuid(),
        payload: uuid(),
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

export const read = async (linkId: string): Promise<Link> => {
    const params = {
        Key: { link_id: linkId }
    }

    const readResult = await linksDB
        .get(params)
        .promise();

    return toAppModel(readResult.Item);
};

export const update = async (linkId: string, newPayload): Promise<Link> => {
    const params = {
        Key: { link_id: linkId },
        AttributeUpdates: _.mapValues(
            newPayload,
            payload => ({ Action: 'PUT', Value: payload })
        ),
        ReturnValues: 'ALL_NEW',
    };

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

    // Returns, empty object
    const deletedRecord = await linksDB
        .delete(params)
        .promise();

    return toAppModel(deletedRecord.Attributes);
};

const toDbModel = (link: Link) => ({
    link_id: link.linkId,
    payload: link.payload,
});

const toAppModel = (link): Link => ({
    linkId: link.link_id,
    payload: link.payload,
});