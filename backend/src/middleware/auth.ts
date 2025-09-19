//auth middleware

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
import { prisma } from '../db';

interface AuthRequest extends Request {
    user?: any;
}

export const Auth = async (req: AuthRequest, res: Response, next: NextFunction)=>{

    const header = req.headers.authorization

    if(!header){
        console.error("No no, signin first!")
        return res.status(401).json({error: "Please Signin!"})
    }

    const token: any = header.split(" ")[1]

    try{
        const payload: any = jwt.verify(token, process.env.JWT_SECRET!)
        
        // const authId = payload.sub || payload.id
        const authId = payload.sub? `google:${payload.sub}`: `github:${payload.id}`; //because google gives sub and github gives id(number) so to avoid conflict and conversion into string i added prefix
        const email = payload.email || null
        const name = payload.name

        let user = await prisma.user.findUnique({where:{authId}})   //search user in db with authId if not found, we create new user ;)

        if(!user){
            user = await prisma.user.create({
                data:{
                    authId,
                    email,
                    name,
                }
            })
        }

        req.user = user //adding user to req so that controllers can access it

        next()
    }catch(err){
        return res.status(401).json({error: "Something went wrong, try again!"})
    }
}