import { config } from "../../config";
import { pool } from "../../db";
import type { IIssue } from "./issue.interface"
import jwt from "jsonwebtoken";
const createIssue =async(payload:IIssue,accessToken:string)=>{
    const { title, description, type } = payload;
    if(!title || !description || !type){
        throw new Error('All fields are required')
    }
    const decodeToken = await jwt.verify(accessToken,config.jwtAccessSecret);
    if(!decodeToken){
        throw new Error('Invalid token')
    }
    const userId = (decodeToken as any).id;
    const result = await pool.query(`
        INSERT INTO issues (title, description, type, reporter_id) VALUES ($1, $2, $3, $4) RETURNING *
    `, [title, description, type, userId])

    return result.rows[0];
}

const getAllIssues = async()=>{
    const result = await pool.query(`
        SELECT * FROM issues
    `)
    return result.rows;
}
const getIssueById = async(id:string)=>{
    const result = await pool.query(`
        SELECT * FROM issues WHERE id = $1
    `, [id])
    return result.rows[0];
}
const updateIssue = async(id:string, payload:IIssue)=>{
    const { title, description, type } = payload;
    const result = await pool.query(`
        UPDATE issues
        SET title = $1, 
        description = $2, 
        type = $3 
        WHERE id = $4 
        RETURNING *
    `, [title, description, type, id])
    return result.rows[0];
}
const deleteIssue = async(id:string)=>{
    const result = await pool.query(`
        DELETE FROM issues WHERE id = $1 RETURNING *
    `, [id])
    return result.rows[0];
}

export const issueService = {
    createIssue,
    getAllIssues,
    getIssueById,
    updateIssue,
    deleteIssue
}