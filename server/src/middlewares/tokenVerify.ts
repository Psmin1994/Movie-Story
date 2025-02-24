import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { AppError } from "middlewares/errorHandler.js";

const tokenVerify = (req: Request, res: Response, next: NextFunction) => {
  const secretKey = process.env.ACCESS_TOKEN_SECRET;

  if (!secretKey) {
    let err = new AppError("Failed to load environment variables", 500);

    return next(err);
  }

  passport.authenticate("jwt", { session: false }, (err: Error | AppError, user: any) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return next(new AppError("Access token expired", 401));
      }

      if (err.name === "JsonWebTokenError") {
        return next(new AppError("Invalid access token", 401));
      }

      return next(err);
    }

    console.log(user);

    req.user = user;

    next();
  })(req, res, next);
};

export default tokenVerify;
