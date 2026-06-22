import { NextFunction, Request, Response } from "express";
import jwt = require("jsonwebtoken");

// https://dev.to/mrcyberwolf/node-js-api-authentication-with-jwt-json-web-token-auth-middleware-ggm

export const requireAuth = (
  req: any,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Access denied." });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "123123123",
    );
    req.user = decoded;
    next();

  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
};
