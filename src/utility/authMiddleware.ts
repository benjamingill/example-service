import _ from "lodash";
import { validateToken } from "./authHelper";

export default () => async (handler, next) => {
  const headers = _.get(handler, "event.headers", {});

  const { principalId, email } = await validateToken(headers.Authorization);

  _.set(handler, "context.email", email);
  _.set(handler, "context.principalId", principalId);

  await next();
};
