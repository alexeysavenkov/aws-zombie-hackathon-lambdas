import uuid from 'uuid';
import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function search(event, context, callback) {

  var phone = event.pathParameters['query']
  var username = event.pathParameters['query']

  console.log('kek', phone, username)

  const userParams = {
      TableName : "User",
      ProjectionExpression:"id, phone, username, image",
      FilterExpression: "phone = :phone or contains(username, :username)",
      ExpressionAttributeValues: {
          ":phone": phone,
          ":username": username
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

export async function add(event, context, callback) {

  var userId = event.request.userAttributes.sub

  var phone = event.pathParameters['query']
  var username = event.pathParameters['query']

  console.log('kek', phone, username)

  const userParams = {
      TableName : "User",
      ProjectionExpression:"id, phone, username, image",
      FilterExpression: "phone = :phone or contains(username, :username)",
      ExpressionAttributeValues: {
          ":phone": phone,
          ":username": username
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