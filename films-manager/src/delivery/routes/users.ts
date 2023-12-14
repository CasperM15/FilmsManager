import express from 'express'
import { IUsersController } from '../controllers/users-controller';
import { ISessionService } from '../../domain/services/session-service';

const { UsersController } = require("../controllers/users-controller");
const  SessionService  = require("../../domain/services/session-service");

const router = express.Router();
const _userController: IUsersController = new UsersController();
const _sessionService: ISessionService = new SessionService();

router.post('/', (req, res, next) => {
    _userController.add(req, res, next);
})

router.post('/login', (req, res, next) => {
    _userController.login(req, res, next);
})

router.post('/logout', _sessionService.verificateToken, (req, res, next) => {
    _userController.logout(req, res, next);
})

router.get('/check', (_req, res, _next) => {
    res.status(200).json({message: 'OK'});
})

export default router