import { NextFunction,Request,Response } from "express";

type AsyncController = (req:Request,res:Response,next : NextFunction)=>Promise<any>;

const  asyncHandler = (fn:AsyncController)=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        return Promise.resolve(fn(req,res,next)).catch(next);
    }
}

export default asyncHandler;