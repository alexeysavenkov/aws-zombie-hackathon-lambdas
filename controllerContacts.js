import uuid from 'uuid';
import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function search(event, context, callback) {

  var phone = event.pathParameters['query']
  var lowerUsername = event.pathParameters['query']
  var upperUsername = lowerUsername.substr(0, lowerUsername.length - 1) + String.fromCharCode(lowerUsername.charCodeAt(lowerUsername.length-1)+1)

  console.log('kek', phone, lowerUsername, upperUsername)

  const userParams = {
      TableName : "User",
      ProjectionExpression:"id, phone, username, image",
      FilterExpression: "phone = :phone or (username between :lowerUsername and :upperUsername)",
      ExpressionAttributeValues: {
          ":phone": phone,
          ":lowerUsername": lowerUsername,
          ":upperUsername": upperUsername
      }
  };

  try {
    const userResult = await dynamoDbLib.call('scan', userParams);
    console.log('userResult', userResult)
    const users = userResult.Items
    console.log('users', users)
    if (users) {
      // Return the retrieved item
      callback(null, success(users));
    }
    else {
      callback(null, failure({status: false, error: 'Item not found.'}));
    }
  }
  catch(e) {
    callback(null, failure({status: false}));
  }
}