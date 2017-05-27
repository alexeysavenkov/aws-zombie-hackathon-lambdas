import uuid from 'uuid';
import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context) {

  var userId = event.request.userAttributes.sub
  var email = event.request.userAttributes.email

  console.log(event.request.userAttributes)
  console.log('kek', userId, email)

  const params = {
    TableName: 'User',
    Item: {
      id: userId,
      email: email,
      username: email,
      contacts: {"NS": []},
      chatIds: {"NS": []}
    },
  };

  console.log(params)

  try {
    const result = await dynamoDbLib.call('put', params);
    console.log('success', result)
    context.done(null, event)
  }
  catch(e) {
    console.log('failure', e)
    callback(null, failure({status: false}));
    context.done(e, event)
  }
};