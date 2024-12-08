import { ApiHandler, TokenGenerator } from "@utils";
import { isFirstUser } from "@server";
import { apiRouter } from "server/routes";
import { Database } from "@database";
import { Request, Response } from "express";

apiRouter.post(
  "/auth/login",
  ApiHandler(async (req: Request, res: Response) => {
    const { email, password, first_name, last_name } = req.body;
    if (!email || !password || !first_name || !last_name) {
      return {
        status: 400,
        message: "Missing required fields",
      };
    }

    const DBResponse = await Database.CREATE("users", {
      first_name,
      last_name,
      email,
      password,
      role: isFirstUser ? "root" : "user",
    });

    if (DBResponse.status === 200) {
      const { access_token, refresh_token } = TokenGenerator({
        _id: DBResponse.data._id,
        role: DBResponse.data.role,
      });

      res.cookie("access_token", access_token, {
        secure: true,
        httpOnly: true,
      });
      res.cookie("refresh_token", refresh_token, {
        secure: true,
        httpOnly: true,
      });

      Database.CREATE("logs", {
        user: DBResponse.data._id,
        message: "new account created",
        refresh_token,
        browser: req.headers["user-agent"],
        os: (req.headers["os"] as string) || "unknown",
        ip: req.ip,
        date: new Date(),
      });
    }

    return DBResponse;
  })
);

apiRouter.post(
  "/auth/login",
  ApiHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return {
        status: 400,
        message: "Missing required fields",
      };
    }
    const DBResponse = await Database.FIND_ONE("users", {
      email,
      password,
    });

    if (DBResponse.status === 200) {
      const { access_token, refresh_token } = TokenGenerator({
        _id: DBResponse.data?._id,
        role: DBResponse.data?.role,
      });

      res.cookie("access_token", access_token, {
        secure: true,
        httpOnly: true,
      });
      res.cookie("refresh_token", refresh_token, {
        secure: true,
        httpOnly: true,
      });
    }
    return DBResponse;
  })
);

apiRouter.post(
  "/auth/logout",
  ApiHandler(async (req: Request, res: Response) => {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    return {
      status: 200,
      message: "success",
    };
  })
);
