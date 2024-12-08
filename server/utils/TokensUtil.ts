import JWT from "jsonwebtoken";

export function TokenGenerator(payloadData: any) {
  try {
    const payload = JSON.stringify(payloadData);
    if (!process.env.ACCESS_JWT_SECRET_KEY) {
      throw new Error(`please provide "ACCESS_JWT_SECRET_KEY" in .env`);
    }
    if (!process.env.ACCESS_JWT_EXPIRATION_TIME) {
      throw new Error(`please provide "ACCESS_JWT_EXPIRATION_TIME" in .env`);
    }
    if (!process.env.REFRESH_JWT_SECRET_KEY) {
      throw new Error(`please provide "REFRESH_JWT_SECRET_KEY" in .env`);
    }
    if (!process.env.REFRESH_JWT_EXPIRATION_TIME) {
      throw new Error(`please provide "REFRESH_JWT_EXPIRATION_TIME" in .env`);
    }
    const access_token = JWT.sign(payload, process.env.ACCESS_JWT_SECRET_KEY, {
      expiresIn: process.env.ACCESS_JWT_EXPIRATION_TIME,
    });

    const refresh_token = JWT.sign(
      payload,
      process.env.REFRESH_JWT_SECRET_KEY,
      {
        expiresIn: process.env.REFRESH_JWT_EXPIRATION_TIME,
      }
    );
    return { access_token, refresh_token };
  } catch (error) {
    throw new Error(`Failed to generate token: ${error}`);
  }
}

export function TokenVerifier(token: string, type: "access" | "refresh") {
  try {
    if (!process.env.ACCESS_JWT_SECRET_KEY) {
      throw new Error(`please provide "ACCESS_JWT_SECRET_KEY" in .env`);
    }
    if (!process.env.REFRESH_JWT_SECRET_KEY) {
      throw new Error(`please provide "REFRESH_JWT_SECRET_KEY" in .env`);
    }
    if (type === "access") {
      return JSON.parse(
        JWT.verify(token, process.env.ACCESS_JWT_SECRET_KEY) as string
      );
    } else if (type === "refresh") {
      return JSON.parse(
        JWT.verify(token, process.env.REFRESH_JWT_SECRET_KEY) as string
      );
    }
  } catch (error) {
    throw new Error(`Failed to verify token: ${error}`);
  }
}
