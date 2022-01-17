import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleware from "../lib/CommonMiddleware";
const { v4: uuidv4 } = require("uuid");

const dynamodb = new AWS.DynamoDB.DocumentClient();
const lambda = new AWS.Lambda();

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

export const addUser = commonMiddleware(async (evt, ctx) => {
  const { email } = evt.body;
  const uuid = uuidv4();

  console.log("Getting called")
  console.log("Testing")

  if (!email) {
  console.log("Invalid Email Example")
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

  const msg = {
    to: email.toLowerCase(),
    from: "noreply@ryan-schachte.com",
    subject: "Ryan Schachte's Newsletter",
    templateId: "d-2f73ed5dc2fa4bf4a818d21157e7cb3f",
  };

  console.log(`Sending email with ${process.env.SEND_GRID_API_KEY}`)

  await sgMail.send(msg);

  console.log(`Email Sent!`)

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Credentials": "*",
    },
    body: JSON.stringify({ message: "Subscribed! Check Email.", email }),
  };
});

export const getUsers = commonMiddleware(async (evt, ctx) => {
  console.log("invocation executed");
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
});

export const sendMail = commonMiddleware(async (evt, ctx) => {
  var params = {
    FunctionName: "newsletter-dev-retrieveAllSubscribers",
    InvocationType: "RequestResponse",
    LogType: "Tail",
  };

  const result = await lambda.invoke(params).promise();
  return JSON.parse(result.Payload);
});

export const removeUser = commonMiddleware(async (evt, ctx) => {
  const body = JSON.parse(evt.body);
});
