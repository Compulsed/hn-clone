import * as BbPromise from 'bluebird'
import * as AWS from 'aws-sdk';

const lambda = new AWS.Lambda();

const servicePrefix = `hn-clone-ddb-${process.env.SERVICE_STAGE}`;

export const invokeLambda = (lambdaName, event, opts = {}) => {
    const fullLambdaName = `${servicePrefix}-${lambdaName}`;

    const options = Object.assign({
        rawResult: false,
        async: false,
    }, opts)

    const params = {
        FunctionName: fullLambdaName,
        InvocationType: options.async ? 'Event' : 'RequestResponse',
        Payload: JSON.stringify(event),
    };

    console.log(JSON.stringify(event, null, 2));

    return new BbPromise((resolve, reject) => {
        lambda.invoke(params, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('Received result: ', result);

            if (result.FunctionError) {
                reject(new Error(`Error on ${fullLambdaName}`));
                return;
            }

            if (options.rawResult) {
                resolve(result);
            } else {
                if (result.Payload) {
                    resolve(JSON.parse(result.Payload.toString()));
                }
            }

            return reject(new Error('Missing Payload'));
        });
    });
}