import { BadRequest, Unauthorized } from "../domain/errors/errors";
import { User } from "../domain/models/user";

import { IUsersRepository } from "../data-access/repository/users-repository";
import { ISessionService } from "../domain/services/session-service";
import { ICryptoService } from '../domain/services/crypto-service';

const UsersRepository  = require("../data-access/repository/users-repository");
const SessionService  = require("../domain/services/session-service");
const CryptoService = require("../domain/services/crypto-service");

export interface IUsersLogic {
    addUser(user: User): Promise<void>;
    login(user: User): Promise<string>;
    logout(email: string): Promise<void>;
}

class UsersLogic implements IUsersLogic {
    _usersRepository: IUsersRepository;
    _sessionRepository: ISessionService;
    _cryptoService: ICryptoService;
    
    constructor() {
      this._usersRepository = new UsersRepository();
      this._sessionRepository = new SessionService();
      this._cryptoService = new CryptoService();
    }

    async login(user: User): Promise<string> {
        if (!user.email || !user.password) {
            throw new BadRequest('Missing parameters');
        }
        const existingUser: User =  await this._usersRepository.getByEmail(user);
        const decryptedPassword = this._cryptoService.decrypt(existingUser.password);
        if (decryptedPassword === user.password)
        {
            const token = this._sessionRepository.generateToken(existingUser);
            return token;
        }
        else
            throw new Unauthorized('Incorrect password')
    }

    async logout(token: string): Promise<void> {
        this._sessionRepository.RevokeToken(token);
    }
  
    async addUser(user: User): Promise<void> {
        if (!user.email || !user.password || !user.name || !user.surname) {
            throw new BadRequest('Missing parameters');
        }
        user.password = this._cryptoService.encrypt(user.password);
        return await this._usersRepository.save(user);
    }


}
  
module.exports = UsersLogic;