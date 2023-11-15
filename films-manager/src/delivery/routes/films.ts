import express from 'express'
import { IFilmsController } from '../controllers/films-controller';
import { ISessionService } from '../../domain/services/session-service';

const { FilmsController } = require("../controllers/films-controller");
const  SessionService  = require("../../domain/services/session-service");

const router = express.Router();
const _filmsController: IFilmsController = new FilmsController();
const _sessionService: ISessionService = new SessionService();

router.get('/', _sessionService.verificateToken, (req, res, next) => {
    _filmsController.getAll(req, res, next);
})

router.get('/favourites', _sessionService.verificateToken, (req, res, next) => {
    _filmsController.getFavourites(req, res, next);
})

router.get('/:id', _sessionService.verificateToken, (req, res, next) => {
    _filmsController.get(req, res, next);
})

router.post('/favourites', _sessionService.verificateToken, (req, res, next) => {
    _filmsController.addFavourite(req, res, next);
})



export default router