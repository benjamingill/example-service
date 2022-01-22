import { Unauthorized } from "http-errors";
import jwt from "jsonwebtoken";
import JwksRsa from "jwks-rsa";
import P from "bluebird";

type TokenPayload = {
  email: string;
  principalId: string;
};

export async function validateToken(bearerToken: string): Promise<TokenPayload> {
  try {
    if (!bearerToken || bearerToken.split(" ").length != 2) {
      throw new Unauthorized("CREDENTIALS_REQUIRED: No authorization token was found");
    }

    const type = bearerToken.split(" ")[0];
    const token = bearerToken.split(" ")[1];

    if (type !== "Bearer") {
      throw new Unauthorized("CREDENTIALS_BAD_SCHEME: Format is 'Authorization: Bearer <token>'");
    }

    const decodedToken = jwt.decode(token, { complete: true });
    if (!decodedToken) {
      throw new Unauthorized(`Failed to decode token. Please ensure bearer token provided is correct`);
    }

    // eslint-disable-next-line new-cap
    const jwksRsaClient = JwksRsa({
      jwksUri: "https://authentication-service/.well-known/jwks.json",
    });
    const getSigningKey = P.promisify(jwksRsaClient.getSigningKey);
    const secretKey = await getSigningKey(decodedToken.header.kid);

    const { payload } = jwt.verify(token, (secretKey as JwksRsa.CertSigningKey).publicKey, {
      complete: true,
      audience: "https://audience/",
      algorithms: ["RS256"],
      issuer: "https://issuer/",
    });

    return {
      email: payload["https://email-section"],
      principalId: payload.sub,
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Unauthorized(`${error.message} - Token expired at: ${error.expiredAt}`);
    }
    if (error instanceof jwt.NotBeforeError) {
      throw new Unauthorized(`${error.message} - JWT not active before: ${error.date}`);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Unauthorized(`JWT Validation failed. Error: ${error.message}`);
    }
    if (error instanceof Error) {
      throw new Unauthorized(`${error.message}`);
    }

    throw new Unauthorized(`UNKNOWN_REASON: ${error.toString()}`);
  }
}
