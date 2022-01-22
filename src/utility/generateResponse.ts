import { APIGatewayProxyResult } from "aws-lambda";

export default (
  statusCode: number,
  data?: object | string,
  headers?: { [header: string]: boolean | number | string }
): APIGatewayProxyResult => ({
  body: data && JSON.stringify(data),
  statusCode: statusCode,
  headers,
});
