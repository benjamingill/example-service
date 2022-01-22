import { Handler } from "aws-lambda";

export const healthcheckEndPoint: Handler = async function() {
  return {
    body: JSON.stringify({
      status: "ok",
    }),
    statusCode: 200,
  };
};
