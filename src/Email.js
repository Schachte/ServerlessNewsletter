import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleware from '../lib/CommonMiddleware'
const { v4: uuidv4 } = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const addUser = commonMiddleware(async (evt, ctx) => {
  const { email } = evt.body;
  const uuid = uuidv4()

  if (!email) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Invalid Email" }),
    };
  }

  try {
    await dynamodb
      .put({
        TableName: process.env.SUBSCRIBED_USERS_TABLE_NAME,
        Item: { email, uuid },
      })
      .promise();
  } catch (err) {
    console.error(err);
    throw new createError.InternalServerError(err);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Successfully Subscribed", email }),
  };
})

export const getUsers = commonMiddleware(async (evt, ctx) => {
  let users;

  try {
    users = await dynamodb
      .scan({ TableName: process.env.SUBSCRIBED_USERS_TABLE_NAME })
      .promise();
  } catch (err) {
    console.error(err);
    throw new createError.InternalServerError(err);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(users["Items"]),
  };
})

export const removeUser = commonMiddleware(async (evt, ctx) => {
  const body = JSON.parse(evt.body);
});
