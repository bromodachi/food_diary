import { NextFunction, Request, Response } from "express";

class CORS {
  public static handle(req: Request, res: Response, next: NextFunction) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, access_token",
    );
    if ("OPTIONS" === req.method) {
      res.sendStatus(200);
    } else {
      next();
    }
  }
}

export default CORS;
