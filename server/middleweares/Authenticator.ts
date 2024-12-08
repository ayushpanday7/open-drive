import { Request, Response, NextFunction } from "express";
import { Database } from "@database";
import { TokenGenerator, TokenVerifier } from "@utils";

export async function Authenticator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // getting access token and refresh token
  const { access_token, refresh_token } = req.cookies;
  if (!access_token || !refresh_token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // verifying access token and refresh token
  const access_token_payload = TokenVerifier(access_token, "access");
  const refresh_token_payload = TokenVerifier(refresh_token, "refresh");

  // if access token or refresh token is not valid
  if (!access_token_payload && !refresh_token_payload) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // if access token is valid, attach user data and continue
  if (access_token_payload) {
    req.user = {
      _id: access_token_payload._id,
      role: access_token_payload.role,
    };
    return next();
  }

  // if access token is not valid but refresh token is valid
  if (refresh_token_payload) {
    // finding user data from refresh token
    const data = await Database.FIND_ONE("logs", {
      _id: refresh_token_payload._id,
      refresh_token: refresh_token,
    });

    // if user data is not found
    if (data.status !== 200) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // if user data is found
    const userData = await Database.FIND_ONE("users", {
      _id: refresh_token_payload._id,
    });
    if (userData.status !== 200) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // generating new access and refresh token
    const { access_token: new_access_token, refresh_token: new_refresh_token } =
      TokenGenerator({
        _id: refresh_token_payload._id,
        role: refresh_token_payload.role,
      });

    // Update refresh token in database
    await Database.UPDATE_ONE(
      "logs",
      { _id: refresh_token_payload._id },
      { refresh_token: new_refresh_token }
    );

    // updating access and refresh token in cookies
    res.cookie("access_token", new_access_token, {
      secure: true,
      httpOnly: true,
      sameSite: "strict",
      path: "/",
    });
    res.cookie("refresh_token", new_refresh_token, {
      secure: true,
      httpOnly: true,
      sameSite: "strict",
      path: "/",
    });

    // adding user data to request
    req.user = {
      _id: refresh_token_payload._id,
      role: refresh_token_payload.role,
    };
    
    return next();
  }

  return res.status(401).json({ message: "Unauthorized" });
}
