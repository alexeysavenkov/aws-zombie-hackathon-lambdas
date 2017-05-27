import uuid from 'uuid';
import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function search(event, context, callback) {

  var email = event.pathParameters['query']
  var username = event.pathParameters['query']

  console.log('kek', email, username)

  const userParams = {
      TableName : "User",
      ProjectionExpression:"id, email, username, image",
      FilterExpression: "contains(email, :email) or contains(username, :username)",
      ExpressionAttributeValues: {
          ":email": email,
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

  console.log('event',event)
  console.log('context',context)

  var userId = event.requestContext.authorizer.claims.sub
  var newContactId = event.pathParameters['newContactId']
  

  console.log('kek', userId, newContactId)

  const userParams = {
      TableName : "User",
      Key:{
          "id": userId
      },
      UpdateExpression: "ADD contacts :contact",
      ExpressionAttributeValues: {
          ":contact": [newContactId]
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

export async function remove(event, context, callback) {

  console.log('event',event)
  console.log('context',context)

  var userId = event.requestContext.authorizer.claims.sub
  var newContactId = event.pathParameters['newContactId']
  

  console.log('kek', userId, newContactId)

  const userParams = {
      TableName : "User",
      Key:{
          "id": userId
      },
      UpdateExpression: "REMOVE contacts :contact",
      ExpressionAttributeValues: {
          ":contact": [newContactId]
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