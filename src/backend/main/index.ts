require('source-map-support').install();

const uuid = require('uuid/v4');
const fs = require('fs');
const now = require('performance-now');

import * as linkRepository from '../repository/link-repository';
import existingKeys from './existing-keys';

const wait = duration =>
  new Promise(resolve => setTimeout(resolve, duration));

module.exports.handler = async (event: any, ctx: any, cb: any) => {
  console.log(JSON.stringify(event));

  console.log('Waiting 1 second!');
  
  let start;

  await wait(1000);

  console.log('Finished Waiting 1 second!');

  start = now();  
  const createResult = await linkRepository.create();
  console.log(`CREATE: ${(now() - start)}`, createResult);
  
  start = now();    
  const readResult = await linkRepository.read(createResult.linkId);
  console.log(`READ: ${(now() - start)}`, readResult);

  start = now();  
  const updateResult = await linkRepository.update(createResult.linkId, { payload: uuid() });
  console.log(`UPDATE: ${(now() - start)}`, updateResult);
  
  start = now();  
  const batchReadResult = await linkRepository.linkLoader.load(createResult.linkId);
  console.log(`BATCH READ: ${(now() - start)}`, batchReadResult);

  start = now();  
  const deleteResult = await linkRepository.del(createResult.linkId);
  console.log(`DELETE: ${(now() - start)}`, deleteResult);
  
  start = now();  
  const loadExistingKeys = await linkRepository.linkLoader.loadMany(existingKeys);
  console.log(`BATCH, BATCH READ: ${(now() - start)}`/*, loadExistingKeys*/);

  cb(null, 'Successful cb');
};
