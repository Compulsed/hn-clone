import 'source-map-support/register'
import seedData from './seed-data';

const uuid = require('uuid/v4');
const now = require('performance-now');

import * as userRepository from '../repository/user-repository';

export const handler = async (event: any, ctx: any, cb: any) => {
  console.log(JSON.stringify(event));
  
  try {
    let start;

    // ----------------
    // Create
    // ----------------
    start = now();  
    const createResult = await userRepository.create(
      seedData.authorId,
      { name: 'Dale Salter' }
    );
    console.log(`CREATE: ${(now() - start)}`, createResult);
    
    // ----------------
    // Read #1
    // ----------------  
    start = now();    
    const readResult = await userRepository.read(createResult.userId);
    console.log(`READ: ${(now() - start)}`, readResult);

    // ----------------
    // Update
    // ----------------  
    start = now();  
    const updateResult = await userRepository.update(
      createResult.userId,
      { name: 'Updated Dale Salter'}
    );
    console.log(`UPDATE: ${(now() - start)}`, updateResult);
    
    // ----------------
    // BATCH READ UPDATE
    // ----------------  
    start = now();  
    const loadExistingKeys = await userRepository.userLoader.load(createResult.userId);
    console.log(`BATCH READ: ${(now() - start)}`/*, loadExistingKeys*/);

    // ----------------
    // Delete
    // ----------------
    // start = now();  
    // const deleteResult = await userRepository.del(createResult.userId);
    // console.log(`DELETE: ${(now() - start)}`, deleteResult);
    

    cb(null, 'Successful cb');
  } catch (err) {
    console.log(err.stack);

    cb(err);
  }
};
