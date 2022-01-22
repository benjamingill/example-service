import { APIGatewayProxyHandler } from "aws-lambda";
import config from "config";
import { databaseMiddleware } from "./databaseMiddleware";
import authMiddleware from "./authMiddleware";

export default (handler: APIGatewayProxyHandler): APIGatewayProxyHandler =>
  middlewareHelper(handler)
    .use(databaseMiddleware({ dbConfig: config.db }))
    .use(authMiddleware());
