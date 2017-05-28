import uuid from 'uuid';
import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function get(event, context, callback) {

  var userId = event.requestContext.authorizer.claims.sub

  const userParams = {
    TableName: 'User',
    Key: {
      id: userId
    }
  };

  try {
    const userResult = await dynamoDbLib.call('get', userParams);
    const user = userResult.Item
    console.log(userResult)
    if (user) {
      const chatIds = (user.chatIds || {values: []}).values

      console.log('chatIds', user.chatIds, chatIds)

      const chatParams = {
        TableName: 'Chat',
        ScanFilter: {
          "id": {
            AttributeValueList: chatIds,
            ComparisonOperator: "IN"
          }
        }
      };

      if(chatIds.length == 0) {
        callback(null, success([]));
        return;
      }

      const chatsResult = await dynamoDbLib.call('scan', chatParams);

      console.log(chatsResult)

      // Return the retrieved item
      callback(null, success(chatsResult.Items));
    }
    else {
      callback(null, success([]));
    }
  }
  catch(e) {
    console.log(e)
    callback(null, failure({status: false}));
  }
}


export function remove(event, context, callback) {

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