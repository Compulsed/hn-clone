const tableName = process.env.userTable || 'Unknown';

const AWS = require('aws-sdk');
const uuid = require('uuid/v4');
const _ = require('lodash');
const DataLoader = require('dataloader');

interface User {
    userId: string,
    name: string,
};

interface UserCreationObject {
    name: string
};

interface UserUpdateObject {
    name: string
};

const usersDb = new AWS.DynamoDB.DocumentClient({
    params: { TableName: tableName },
});

export const userLoader = new DataLoader(
    keys => batchRead(keys)
);

const batchRead = async (userIds: Array<string>): Promise<Array<User>> => {
    const params = {
        RequestItems: {
            [tableName]: {
                Keys: userIds.map(userId => ({ user_id: userId })),
            },
        },
    };

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

    if (!readResult.Item) {
        throw new Error(`${userId}: User Not found`);
    }

    return toAppModel(readResult.Item);
};

export const create = async (userId, creationObject: UserCreationObject): Promise<User> => {
    const item = { 
        userId: userId,
        name: creationObject.name
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

export const update = async (userId: string, userUpdateObject: UserUpdateObject): Promise<User> => {
    const params = {
        Key: { user_id: userId },
        AttributeUpdates: _.mapValues(
            userUpdateObject,
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