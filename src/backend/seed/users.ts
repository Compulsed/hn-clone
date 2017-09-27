import 'source-map-support/register'
import seedData from './seed-data';

const uuid = require('uuid/v4');

import * as userRepository from '../repository/user-repository';

export const handler = async (event: any, ctx: any, cb: any) => {
  console.log(JSON.stringify(event));
  
  try {
    let start;

    // ----------------
    // Create
    // ----------------  
    const createResult = await userRepository.create(
      seedData.authorId,
      { name: 'Dale Salter' }
    );
    console.log(`CREATE:`, createResult);
    
    // ----------------
    // Read #1
    // ----------------      
    const readResult = await userRepository.read(createResult.userId);
    console.log(`READ:`, readResult);

    // ----------------
    // Update
    // ----------------    
    const updateResult = await userRepository.update(
      createResult.userId,
      { name: 'Updated Dale Salter'}
    );
    console.log(`UPDATE:`, updateResult);
    
    // ----------------
    // BATCH READ UPDATE
    // ----------------    
    const loadExistingKeys = await userRepository.userLoader.load(createResult.userId);
    console.log(`BATCH READ:`/*, loadExistingKeys*/);

    // ----------------
    // Delete
    // ----------------
    // const deleteResult = await userRepository.del(createResult.userId);
    // console.log(`DELETE:`, deleteResult);
    

    cb(null, 'Successful cb');
  } catch (err) {
    console.log(err.stack);

    cb(err);
  }
};
