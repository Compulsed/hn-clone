require('source-map-support').install();

import * as linkRepository from '../repository/link-repository';

const uuid = require('uuid/v4');

const wait = duration =>
  new Promise(resolve => setTimeout(resolve, duration));

module.exports.handler = async (event: any, ctx: any, cb: any) => {
  console.log(JSON.stringify(event));

  console.log('Waiting 1 second!');
  
  await wait(1000);

  console.log('Finished Waiting 1 second!');

  const createResult = await linkRepository.create();
  console.log('CREATE', createResult);

  let readResult = await linkRepository.read(createResult.linkId);
  console.log('READ:', readResult);

  const updateResult = await linkRepository.update(createResult.linkId, { payload: uuid() });
  console.log('UPDATE:', updateResult);

  readResult = await linkRepository.read(createResult.linkId);
  console.log('READ:', readResult);

  const deleteResult = await linkRepository.del(createResult.linkId);
  console.log('DELETE:', deleteResult);
  
  cb(null, 'Successful cb');
};
