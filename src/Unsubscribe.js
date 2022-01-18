import AWS from "aws-sdk";
import commonMiddleware from "../lib/CommonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const unsubscribeUser = commonMiddleware(async (evt, ctx) => {
  console.log(evt.queryStringParameters);
  console.log(evt);

  return {
    statusCode: 301,
    headers: {
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Credentials": "*",
      Location: "https://ryan-schachte.com",
    },
  };
});
