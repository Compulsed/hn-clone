const tableName = process.env.userTable || 'Unknown';

const AWS = require('aws-sdk');
const uuid = require('uuid/v4');
const _ = require('lodash');
const DataLoader = require('dataloader');

interface User {
    userId: string,
    name: string,
};

const usersDb = new AWS.DynamoDB.DocumentClient({
    params: { TableName: tableName },
});

export const userLoader = new DataLoader(
    keys => batchRead(keys)
);

export const batchRead = async (userIds: Array<string>) => {
    const params = {
        RequestItems: {
            [tableName]: {
                Keys: userIds.map(userId => ({ user_id: userId })),
            }
        }
    }

    const readResult = await usersDb
        .batchGet(params)
        .promise();

    return readResult.Responses[tableName].map(toAppModel);
}

export const read = async (userId: string): Promise<User> => {
    const params = {
        Key: { user_id: userId }
    }

    const readResult = await usersDb
        .get(params)
        .promise();

    return toAppModel(readResult.Item);
};

export const create = async (): Promise<User> => {
    const item = { 
        userId: uuid(),
        payload: uuid(),
    };

    const params = {
        Item: toDbModel(item),
    };

    // Returns empty object
    const putResult = await usersDb
        .put(params)
        .promise();

    return item;
};

export const update = async (userId: string, newPayload): Promise<User> => {
    const params = {
        Key: { user_id: userId },
        AttributeUpdates: _.mapValues(
            newPayload,
            payload => ({ Action: 'PUT', Value: payload })
        ),
        ReturnValues: 'ALL_NEW',
    };

    // Returns, updated user
    const updateResult = await usersDb
        .update(params)
        .promise();

    return toAppModel(updateResult.Attributes);
};

export const del = async (userId: string): Promise<User>  => {
    const params = {
        Key: { user_id: userId },
        ReturnValues: 'ALL_OLD',
    }

    // Returns, old object
    const deletedRecord = await usersDb
        .delete(params)
        .promise();

    return toAppModel(deletedRecord.Attributes);
};

const toDbModel = (user: User) => ({
    user_id: user.userId,
    name: user.name,
});

const toAppModel = (user): User => ({
    userId: user.user_id,
    name: user.name,
});