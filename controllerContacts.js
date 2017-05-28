import uuid from 'uuid';
import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function search(event, context, callback) {

  var userId = event.requestContext.authorizer.claims.sub
  var email = event.pathParameters['query']
  var username = event.pathParameters['query']

  console.log('kek', email, username)

  const userParams = {
      TableName : "User",
      ProjectionExpression:"id, email, username, image",
      FilterExpression: "(contains(email, :email) or contains(username, :username)) and id <> :userId",
      ExpressionAttributeValues: {
          ":email": email,
          ":username": username,
          ":userId": userId
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
      callback(null, success([]));
    }
  }
  catch(e) {
    console.log(e)
    callback(null, failure({status: false}));
  }
}

export async function manip(event, context, callback) {

  console.log(event)

  switch(event.httpMethod) {

    case "GET":

      var userId = event.requestContext.authorizer.claims.sub

      console.log('userId', userId)

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
          const contactIds = (user.contacts || {values: []}).values

          console.log('contactIds', user.contacts, contactIds)

          const contactParams = {
            TableName: 'User',
            ScanFilter: {
              "id": {
                AttributeValueList: contactIds,
                ComparisonOperator: "IN"
              }
            }
          };

          if(contactIds.length == 0) {
            callback(null, success([]));
            return;
          }

          const contactsResult = await dynamoDbLib.call('scan', contactParams);

          console.log(contactsResult)

          // Return the retrieved item
          callback(null, success(contactsResult.Items));
        }
        else {
          callback(null, success([]));
        }
      }
      catch(e) {
        console.log(e)
        callback(null, failure({status: false}));
      }

      break;

    case "PUT":

      console.log('event',event)
      console.log('context',context)

      var userId = event.requestContext.authorizer.claims.sub
      var newContactId = event.pathParameters['contactId']
      

      console.log('kek', userId, newContactId)

      var userParams = {
          TableName : "User",
          Key:{
              "id": userId
          },
          UpdateExpression: "ADD contacts :contact",
          ExpressionAttributeValues: {
              ":contact": dynamoDbLib.createSet([newContactId])
          },
          ReturnValues: "ALL_NEW"
      };

      try {
        const userResult = await dynamoDbLib.call('update', userParams);
        console.log('userResult', userResult)
        const users = userResult.Attributes
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
        console.log('error', e)
        callback(null, failure({status: false}));
      }

      break;

    case "DELETE":

      console.log('event',event)
      console.log('context',context)

      var userId = event.requestContext.authorizer.claims.sub
      var contactToRemove = event.pathParameters['contactId']
      

      console.log('kek', userId, contactToRemove)

      var userParams = {
          TableName : "User",
          Key:{
              "id": userId
          },
          UpdateExpression: "REMOVE contacts :contact",
          ExpressionAttributeValues: {
              ":contact": dynamoDbLib.createSet([contactToRemove])
          },
          ReturnValues: "ALL_NEW"
      };

      try {
        const userResult = await dynamoDbLib.call('update', userParams);
        console.log('userResult', userResult)
        const users = userResult.Attributes
        console.log('users', users)
        if (users) {
          // Return the retrieved item
          callback(null, success(users));
        }
        else {
          callback(null, success([]));
        }
      }
      catch(e) {
        console.log(e)
        callback(null, failure({status: false}));
      }

      break;

    default:
      callback(null, failure({status: false, error: 'Method not supported'}));

      break;
  }
}
