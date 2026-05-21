import { config } from "../../config";
import { pool } from "../../db";
import type { ILogin, IUser } from "./auth.interface";
import bcrypt from 'bcrypt';
import jwt, { type JwtPayload } from 'jsonwebtoken';

const registerIntoDB= async(payload:IUser) =>{
    const {name,email,password,role='contributor'} = payload;

    //todo first we have to check , is there any user with same email exist or not

    const existingUser = await pool.query(
        `SELECT * FROM users WHERE email = $1`
        , [email]
    );
    if(existingUser.rows.length > 0){
        throw new Error('User with this email already exists');
    }

    //todo hash password before insert into db

    const hashPassword = await bcrypt.hash(password,12);

    //todo insert user into db

    const result = await pool.query(`
        INSERT INTO users (name,email,password,role,created_at)
        VALUES ($1,$2,$3,$4,NOW())
        RETURNING *
    `,[name,email,hashPassword,role]);

     delete result.rows[0].password;
    return result.rows[0];
}

const loginUser = async(payload:ILogin) =>{
    const {email,password} = payload;

    //todo check user exist or not
    const userData = await pool.query(`
        SELECT * FROM users WHERE email = $1
    `,[email]);

    const existingUser = userData.rows[0];
    if(!existingUser){
        throw new Error('Email is incorrect');
    }

    //todo compare password
    const userPassword = existingUser.password;
    const isPasswordMatch = await bcrypt.compare(password,userPassword);

    if(!isPasswordMatch){
        throw new Error('Password is incorrect');
    }

    //todo if all is correct, generate access token and refresh token 

    const jwtPayload = {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role
    } as JwtPayload;

    //todo generate access token
    const accessToken = jwt.sign(jwtPayload, config.jwtAccessSecret,{
        expiresIn: '15m'
    });

    //todo generate refresh token
    const refreshToken = jwt.sign(jwtPayload, config.jwtRefreshSecret,{
        expiresIn: '7d'
    });
    delete existingUser.password;
    // console.log(existingUser);
    // return {accessToken,refreshToken};
    return { token:{accessToken, refreshToken}, user: existingUser };
}

const refreshToken = async(payload:string) =>{
    const refreshToken = payload;

    if(!refreshToken){
        throw new Error('Refresh token is missing');
    }
    //todo verify refresh token

    const decoded = jwt.verify(
        refreshToken, 
        config.jwtRefreshSecret
    ) as JwtPayload;

    const userData = await pool.query(`
        SELECT * FROM users WHERE email= $1
        `,[decoded.email]
    );
    const existingUser = userData.rows[0];
    if(!existingUser){
        throw new Error('User not found');
    }
    //todo generate new access token
    const jwtPayload = {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role
    } as JwtPayload;
    
    const newAccessToken = jwt.sign(jwtPayload, config.jwtAccessSecret, {
        expiresIn: '1h'
    });

    return { accessToken: newAccessToken };
}

export const authService = {
    registerIntoDB,
    loginUser,
    refreshToken
}