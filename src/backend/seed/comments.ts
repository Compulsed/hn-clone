import 'source-map-support/register'
import seedData from './seed-data';

const uuid = require('uuid/v4');

import * as commentRepository from '../repository/comment-repository';

export const handler = async (event: any, ctx: any, cb: any) => {
  console.log(JSON.stringify(event));
  
  try {  
    let start;

    const commentId = uuid();

    // ----------------
    // Create
    // ----------------
    const createResult = await commentRepository.create(
        commentId,
        {   
            linkId: seedData.linkId,
            authorId: seedData.authorId,
            body: 'Interesting Body'
        }
    );
    console.log(`CREATE:`, createResult);
    
    // ----------------
    // Read #1
    // ----------------    
    const readResult = await commentRepository.read(commentId);
    console.log(`READ:`, readResult);

    // ----------------
    // Update
    // ----------------    
    const updateResult = await commentRepository.update(
      commentId,
      { body: 'Interesting Body #2' }    
    );
    console.log(`UPDATE:`, updateResult);
    
    // ----------------
    // BATCH READ UPDATE
    // ----------------    
    const batchReadResult = await commentRepository.commentLoader.load(commentId);
    console.log(`BATCH READ:`, batchReadResult);

    // ----------------
    // Delete
    // ----------------  
    // start = now();  
    // const deleteResult = await commentRepository.del(createResult.linkId);
    // console.log(`DELETE:`, deleteResult);
    
    cb(null, 'Successful cb');
  } catch (err) {
    console.log(err.stack);

    cb(err);
  }
};
