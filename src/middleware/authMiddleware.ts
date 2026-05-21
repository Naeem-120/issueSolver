import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { pool } from "../db";
import type { TRole } from "../types";
const authMiddleware = (...roles: TRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
        //todo verify token
    //* token present in header
    const token = req.headers.authorization;
    //todo check if token is present
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    //todo verify the user with the token and db

    const decoded = jwt.verify(
      token as string,
      config.jwtAccessSecret as string,
    ) as JwtPayload;

    const userData = await pool.query(
      `
            SELECT * FROM users WHERE email = $1 and id = $2
        `,
      [decoded.email, decoded.id],
    );

    if (userData.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    //todo add role based access control
    if (roles.length && !roles.includes(userData.rows[0].role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden:U are not allowed to access here",
      });
    }
    req.user = userData.rows[0];
    next();
    } catch (error: any) {
        return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }  
  };
};
export default authMiddleware;
