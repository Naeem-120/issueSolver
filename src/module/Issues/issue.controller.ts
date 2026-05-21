import type { Request, Response } from "express";
import sendResponse from "../../utility/response";

const createIssue = async (req: Request, res: Response) => {
    try {
        
    } catch (error: any) {
        sendResponse(res,{
            statusCode: 500,
            success: false,
            message: 'Something went wrong',
            error: error.message  
        })
    }
}
const getIssue = async (req: Request, res: Response) => {
    try {
        
    } catch (error: any) {
        sendResponse(res,{
            statusCode: 500,
            success: false,
            message: 'Something went wrong',
            error: error.message  
        })
    }
}
const getIssueById = async (req: Request, res: Response) => {
    try {
        
    } catch (error: any) {
        sendResponse(res,{
            statusCode: 500,
            success: false,
            message: 'Something went wrong',
            error: error.message  
        })
    }
}
const updateIssue = async (req: Request, res: Response) => {
    try {
        
    } catch (error: any) {
        sendResponse(res,{
            statusCode: 500,
            success: false,
            message: 'Something went wrong',
            error: error.message  
        })
    }
}
const deleteIssue = async (req: Request, res: Response) => {
    try {
        
    } catch (error: any) {
        sendResponse(res,{
            statusCode: 500,
            success: false,
            message: 'Something went wrong',
            error: error.message  
        })
    }
}

export const issueController = {
    createIssue,
    getIssue,
    getIssueById,
    updateIssue,
    deleteIssue
}