import * as _ from 'lodash';

import { ProxyResult } from 'aws-lambda';

export const getHeaders = headers => (_.assign({}, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,POST',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
}, headers))
  
export const createResponse = (code, body, headers = {}): ProxyResult => ({
    statusCode: code,
    headers: _.assign(
        {},
        getHeaders(headers),
        headers
    ),
    body: JSON.stringify(body),
});