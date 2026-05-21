import type { NextFunction, Request, Response } from "express";
import sendResponse from "../utility/response";

export const globalErrorHandler = (
    error:any,
    req:Request,
    res:Response,
    next:NextFunction
) =>{
    // sendResponse(res,{
    //     statusCode: 500,
    //     success: false,
    //     message: "Internal server error",
    //     error: error.message
    // })
    res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message
    })
}