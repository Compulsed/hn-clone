import * as userRepository from '../repository/user-repository';

const uuid = require('uuid/v4');

export const getUser = async (userId) =>
    userRepository.read(userId);

export const getUsers = async (userIds) =>
    userRepository.userLoader.loadMany(userIds);

export const createUser = async (userId, userCreationObject) =>
    userRepository.create(userId, userCreationObject);

export const updateUser = async (userId, updateObject) =>
    userRepository.update(userId, updateObject);
    
export const deleteUser = async userId =>
    userRepository.del(userId);