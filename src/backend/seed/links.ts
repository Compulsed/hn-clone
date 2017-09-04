import 'source-map-support/register'
import seedData from './seed-data';

const uuid = require('uuid/v4');
const now = require('performance-now');

import * as linkRepository from '../repository/link-repository';

export const handler = async (event: any, ctx: any, cb: any) => {
  console.log(JSON.stringify(event));
  
  try {  
    let start;

    // ----------------
    // Create
    // ----------------
    start = now();  
    const createResult = await linkRepository.create(
      seedData.linkId,
      { authorId: seedData.authorId, title: 'Funny Title' }
    );
    console.log(`CREATE: ${(now() - start)}`, createResult);
    
    // ----------------
    // Read #1
    // ----------------    
    start = now();    
    const readResult = await linkRepository.read(createResult.linkId);
    console.log(`READ: ${(now() - start)}`, readResult);

    // ----------------
    // Update
    // ----------------    
    start = now();  
    const updateResult = await linkRepository.update(
      createResult.linkId,
      { authorId: seedData.authorId, title: 'Funny Title' }    
    );
    console.log(`UPDATE: ${(now() - start)}`, updateResult);
    
    // ----------------
    // BATCH READ UPDATE
    // ----------------    
    start = now();  
    const batchReadResult = await linkRepository.linkLoader.load(createResult.linkId);
    console.log(`BATCH READ: ${(now() - start)}`, batchReadResult);

    // ----------------
    // Delete
    // ----------------  
    // start = now();  
    // const deleteResult = await linkRepository.del(createResult.linkId);
    // console.log(`DELETE: ${(now() - start)}`, deleteResult);
    
    cb(null, 'Successful cb');
  } catch (err) {
    console.log(err.stack);

    cb(err);
  }
};
