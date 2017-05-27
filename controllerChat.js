import uuid from 'uuid';
import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export function get(event, context, callback) {

  const userParams = {
    TableName: 'User',
    Key: {
      id: event.request.userAttributes.sub
    },
  };

  try {
    const userResult = dynamoDbLib.call('get', params);
    const user = userResult.Item
    console.log(user)
    if (user) {
      const chatIds = user.chatIds || []

      const chatParams = {
        TableName: 'Chat',
        Key: {
          id: chatIds
        },
      };

      const chatsResult = dynamoDbLib.call('get', params);

      console.log(chatsResult)

      // Return the retrieved item
      callback(null, success(chatsResult.Item));
    }
    else {
      callback(null, failure({status: false, error: 'Item not found.'}));
    }
  }
  catch(e) {
    callback(null, failure({status: false}));
  }
}


export function _delete(event, context, callback) {

  const chatIdToDelete = event.pathParameters['chatId']

  const userParams = {
    TableName: 'User',
    Key: {
      id: event.request.userAttributes.sub
    },
  };

  try {
    const userResult = dynamoDbLib.call('get', params);
    const user = userResult.Item
    console.log(user)
    if (user) {
      const chatIds = user.chatIds.filter(id => id != chatIdToDelete)

      const chatParams = {
        TableName: 'Chat',
        Key: {
          id: chatIds
        },
      };

      const chatsResult = dynamoDbLib.call('get', params);

      console.log(chatsResult)

      // Return the retrieved item
      callback(null, success(chatsResult.Item));
    }
    else {
      callback(null, failure({status: false, error: 'Item not found.'}));
    }
  }
  catch(e) {
    callback(null, failure({status: false}));
  }
}