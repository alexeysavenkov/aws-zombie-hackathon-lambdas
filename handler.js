import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

var AWS = require('aws-sdk');

export async function main(event, context, callback) {

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
      context: context
    }),
  };

  callback(null, response);
};
