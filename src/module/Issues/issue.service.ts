import { config } from "../../config";
import { pool } from "../../db";
import type { TParameter } from "../../types";
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

const getAllIssues = async(payload:TParameter)=>{
    const { sort = "newest", type, status } = payload;
    const result = await pool.query(`
        SELECT * FROM issues
        ${
            type && status ? `WHERE type = '${type}' AND status = '${status}'` 
            : type ? `WHERE type = '${type}'`
            : status ? `WHERE status = '${status}'`
            : ''
        }
        order by created_at ${sort === "newest" ? "DESC" : "ASC"}
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