import type { NextFunction, Request, Response } from "express"
import sendResponse from "../utility/response";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { pool } from "../db";
import type { TRole } from "../types";
const authMiddleware =(...roles:TRole[])=>{
    return async(req:Request,res:Response,next:NextFunction)=>{
        //todo verify token
        //* token present in header
        const token= req.headers.authorization;
        //todo check if token is present
        if(!token){
            sendResponse(res,{
                statusCode: 401,
                success: false,
                message: "Unauthorized"
            })
        }

        //todo verify the user with the token and db

        const decoded = jwt.verify(
            token as string, 
            config.jwtAccessSecret as string
        ) as JwtPayload;

        const userData = await pool.query(`
            SELECT * FROM users WHERE email = $1 and id = $2
        `,[decoded.email, decoded.id]);

        if(userData.rowCount === 0){
            sendResponse(res,{
                statusCode: 401,
                success: false,
                message: "User not found"
            })
        }
        //todo add role based access control
        if(roles.length && !roles.includes(userData.rows[0].role)){
            sendResponse(res,{
                statusCode: 403,
                success: false,
                message: "Forbidden:U are not allowed to access here"
            })
        }
        req.user = userData.rows[0];
        next();
    }
}
export default authMiddleware;