import AWS from "aws-sdk";
import commonMiddleware from "../lib/CommonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const unsubscribeUser = commonMiddleware(async (evt, ctx) => {
  console.log(evt.queryStringParameters);
  console.log(evt);
  const email = evt.queryStringParameters["userMetadata"];

  if (email) {
    let bufferObj = Buffer.from(email, "base64");
    let decodedString = bufferObj.toString("utf8").split("_");
    console.log(`We are going to remove ${decodedString[0]} after we compare against ${decodedString[1]} in the DB`)

    return {
      statusCode: 301,
      headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Credentials": "*",
        Location: "https://ryan-schachte.com/unsubscribed",
      },
    };
  }

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
