import { Handler } from "aws-lambda";
import YAML from "js-yaml";
import fs from "fs";

export const loadSwagger: Handler = async function() {
  const data = await YAML.load(fs.readFileSync("./swagger.yaml", "utf8"));
  return {
    body: JSON.stringify(data),
    statusCode: 200,
  };
};
