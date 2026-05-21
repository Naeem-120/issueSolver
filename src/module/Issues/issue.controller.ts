import type { Request, Response } from "express";
import sendResponse from "../../utility/response";
import { issueService } from "./issue.service";
import type { TParameter } from "../../types";

const createIssue = async (req: Request, res: Response) => {
    try {
        const accessToken = req.cookies.accessToken;
        if(!accessToken){
            sendResponse(res,{
                statusCode: 401,
                success: false,
                message: 'Unauthorized'
            })
        }
        const result = await issueService.createIssue(req.body,accessToken);
        if(!result){
            sendResponse(res,{
                statusCode: 400,
                success: false,
                message: 'Failed to create issue',
            })
        }
        sendResponse(res,{
            statusCode: 201,
            success: true,
            message: 'Issue created successfully',
            data: result
        })
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
        const result = await issueService.getAllIssues(req.query as TParameter);
       
        if(!result){
            sendResponse(res,{
                statusCode: 404,
                success: false,
                message: 'No issues found',
            })
        }
        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: 'Issues retrieved successfully',
            data: result
        })
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
        const  id  = req.params.id as string;
        const result = await issueService.getIssueById(id);
        if(!result){
            sendResponse(res,{
                statusCode: 404,
                success: false,
                message: 'Issue not found',
            })
        }
        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: 'Issue retrieved successfully',
            data: result
        })
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
        const  id  = req.params.id as string;
        const token = req.cookies.accessToken;
        const result = await issueService.updateIssue(id,token, req.body);
        if(!result){
            sendResponse(res,{
                statusCode: 404,
                success: false,
                message: 'Issue not found',
            })
        }
        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: 'Issue updated successfully',
            data: result
        })
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
        const  id  = req.params.id as string;
        const result = await issueService.deleteIssue(id);
        if(!result){
            sendResponse(res,{
                statusCode: 404,
                success: false,
                message: 'Issue not found',
            })
        }
        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: 'Issue deleted successfully',
        })
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