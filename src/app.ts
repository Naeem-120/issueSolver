import express, { type Application, type Request, type Response } from 'express'
import { authRouter } from './module/Auth/auth.route';
import { globalErrorHandler } from './middleware/globalErrorHandler';
import cookieParser from "cookie-parser";

const app : Application = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
console.log('App is running');

app.get('/',(req:Request,res:Response)=>{
    res.send('Hi ! Programming Hero Team');
})

app.use('/api/auth',authRouter)

app.use(globalErrorHandler)
export default app;