import AWS from 'aws-sdk';

AWS.config.update({region:'eu-central-1'});

export async function call(action, params) {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  return dynamoDb[action](params).promise();
}

export function createSet(arr) {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  return dynamoDb.createSet(arr)
}

export function emptyStringSet() {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  var set = dynamoDb.createSet('')
  set.values = [];

  return set;
}
