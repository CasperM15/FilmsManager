import express from 'express';

import { User } from '../../domain/models/user';
import { IUsersLogic } from '../../business-logic/users-logic';
import { ISessionService } from '../../domain/services/session-service';

const UsersLogic  = require("../../business-logic/users-logic");
const SessionService = require("../../domain/services/session-service");

export interface IUsersController {
    add(req: express.Request, res: express.Response, next: express.NextFunction): void;
    login(req: express.Request, res: express.Response, next: express.NextFunction): void;
    logout(req: express.Request, res: express.Response, next: express.NextFunction): void;
}

class UsersController implements IUsersController {
    _usersLogic: IUsersLogic;
    _sessionService: ISessionService;

    constructor()
    {
        this._usersLogic = new UsersLogic();
        this._sessionService = new SessionService();
    }

    add = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try 
        {
            const user: User = req.body;
            await this._usersLogic.addUser(user);
            res.status(200).json();
        } 
        catch (error) 
        {
            next(error);
        }
    }

    login = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try 
        {
            const user: User = req.body;
            const token = await this._usersLogic.login(user);
            res.status(200).json({token: token});
        } 
        catch (error) 
        {
            next(error);
        }
    }

    logout = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try 
        {
            const token: string = req.headers['authorization'] || '';
            await this._usersLogic.logout(token.slice(7, token.length));
            res.status(200).json();
        } 
        catch (error) 
        {
            next(error);
        }
    }
}

module.exports = {
    UsersController: UsersController
}