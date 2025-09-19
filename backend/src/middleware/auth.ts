//auth middleware

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

interface AuthRequest extends Request {
    user?: any;
}

export const Auth = (req: AuthRequest, res: Response, next: NextFunction)=>{

    const header = req.header.authorization

    if(!header)
            return res.status(401).json({error: "Please Signin!"})

    const token = header.split(" ")[1]

    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET as string)

        req.user = payload
        next()
    }catch(err){
        return res.status(401).json({error: "Something went wrong, try again!"})
    }
}