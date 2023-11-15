import { Unauthorized } from "../errors/errors";
import { TokenData } from "../models/DTO/tokenData";
import { User } from "../models/user";
import { NextFunction, Request, Response } from 'express';

const Blacklist  = require("../black-list");

require('dotenv').config();

const jwt = require("jsonwebtoken");

export interface  ISessionService {
    generateToken(user: User): string;
    verificateToken(req: Request, res: Response, next: NextFunction): void;
    decodeData(req: Request): TokenData;
    RevokeToken(token: string): void;
};

class SessionService implements ISessionService {
    _blackList;

    constructor() 
    {
        this._blackList = new Blacklist();
    }

    generateToken(user: User): string {
        const payload = {
            email: user.email
        }
        const token = jwt.sign(payload, process.env.JWT_KEY, {
            expiresIn: '1d'
        });
        return token;
    }

    verificateToken = async (req: Request, _res: Response, next: NextFunction) => {
        try {
            let token = req.headers['authorization'];
            if (!token){
                throw new Unauthorized('Missing token')
            }
            if (token.startsWith('Bearer ')){
                token = token.slice(7, token.length);
            }
            if(await this.isTokenRevoked(token))
            {
                throw new Unauthorized('Token revoked')
            }
            if(token){
                jwt.verify(token, process.env.JWT_KEY, (error: any, _decoded: any) => {
                    if(error){
                        throw new Unauthorized('Invalid verification token')
                    }
                    else{  
                        next();
                    }
                })
            }
        } catch (error) {
            next(error);
        }
    }

    decodeData = (req: Request): TokenData => {
        let data: TokenData = {email:''};
        let token = req.headers['authorization'];
        if (token && token.startsWith('Bearer ')){
            token = token.slice(7, token.length);
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        data.email = decoded.email;
        return data;
    }

    RevokeToken(token: string) {
        this._blackList.tokenList.push(token);
    }
    
    isTokenRevoked(token: string) {
        return this._blackList.tokenList.includes(token);
    }
}
  
module.exports = SessionService