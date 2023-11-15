import express from 'express';

import { ISessionService } from '../../domain/services/session-service';
import { IFilmsLogic } from '../../business-logic/film-logic';

import { FavouriteFilmRequest } from '../../domain/models/DTO/favourite-film-request';

const SessionService = require("../../domain/services/session-service");
const FilmsLogic = require("../../business-logic/film-logic");

export interface  IFilmsController {
    getAll(req: express.Request, res: express.Response, next: express.NextFunction): void;
    get(req: express.Request, res: express.Response, next: express.NextFunction): void;
    addFavourite(req: express.Request, res: express.Response, next: express.NextFunction): void;
    getFavourites(req: express.Request, res: express.Response, next: express.NextFunction): void;
}

class FilmsController implements IFilmsController {
    _sessionService: ISessionService;
    _filmsLogic: IFilmsLogic;

    constructor()
    {
        this._sessionService = new SessionService();
        this._filmsLogic = new FilmsLogic();
    }

    getAll = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try 
        {
            const keyword: string | undefined = typeof req.query.keyword === 'string' ? req.query.keyword : undefined;
            const response = await this._filmsLogic.getAll(keyword); 
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    }

    get = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try 
        {
            const id = parseInt(req.params.id, 10)
            const response = await this._filmsLogic.get(id); 
            res.json(response);
        }
        catch (error) {
            next(error);
        }
    }

    addFavourite = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try 
        {
            const body: FavouriteFilmRequest = req.body;
            const user: string =  this._sessionService.decodeData(req).email;
            await this._filmsLogic.addFavourite(body, user);
            res.status(200).json();
        } 
        catch (error) 
        {
            next(error);
        }
    }

    getFavourites = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
          const user: string = this._sessionService.decodeData(req).email;
          const favourites = await this._filmsLogic.getFavourites(user);
          res.status(200).json(favourites);
        } catch (error) {
            next(error);
        }
    };
}

module.exports = {
    FilmsController: FilmsController
}