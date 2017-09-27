import 'source-map-support/register'
import seedData from './seed-data';

const uuid = require('uuid/v4');

import * as linkRepository from '../repository/link-repository';

export const handler = async (event: any, ctx: any, cb: any) => {
  console.log(JSON.stringify(event));
  
  try {  
    let start;

    const linkId = uuid();
    const authorId = uuid();

    // ----------------
    // Create
    // ----------------
    const createResult = await linkRepository.create(
      linkId,
      { authorId: authorId, title: 'Funny Title' }
    );
    console.log(`CREATE:`, createResult);
    
    // ----------------
    // Read #1
    // ----------------    
    const readResult = await linkRepository.read(linkId);
    console.log(`READ:`, readResult);

    // ----------------
    // Update
    // ----------------    
    const updateResult = await linkRepository.update(
      linkId,
      { authorId: authorId, title: 'Funny Title' }    
    );
    console.log(`UPDATE:`, updateResult);
    
    // ----------------
    // BATCH READ UPDATE
    // ----------------    
    const batchReadResult = await linkRepository.linkLoader.load(linkId);
    console.log(`BATCH READ:`, batchReadResult);

    // ----------------
    // Delete
    // ----------------  
    // start = now();  
    // const deleteResult = await linkRepository.del(createResult.linkId);
    // console.log(`DELETE:`, deleteResult);
    
    cb(null, 'Successful cb');
  } catch (err) {
    console.log(err.stack);

    cb(err);
  }
};
