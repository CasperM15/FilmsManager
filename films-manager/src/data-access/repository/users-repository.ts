import * as path from 'path';
import { User } from '../../domain/models/user';
import { Conflict, NotFound } from '../../domain/errors/errors';
const fs = require('fs');

export interface IUsersRepository {
    save(user: User): Promise<void>;
    getByEmail(user: User): Promise<User>;
}

class UsersRepository implements IUsersRepository {
    _users: string 

    constructor() {
      this._users = path.join(__dirname, '..', 'collections', 'users.txt');
    }

    getByEmail(user: User): Promise<User> {
        return new Promise((resolve, reject) => {
          fs.readFile(this._users, 'utf8', (err: any, data: any) => {
            if (err) {
              reject(new Error('DB Access Error'));
            } else {
              const favourites: User[] = data ? JSON.parse(data) : [];
              const existingUser = favourites.find((existingUser: User) => existingUser.email === user.email);
              if (existingUser) 
                resolve(existingUser);
              else 
                reject(new NotFound('No user with that email'));
            }
          });
        });
    }
  
    save(user: User): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.readFile(this._users, 'utf8', async (err: any, data: any) => {
                if (err) {
                    reject(new Error('DB Access Error'));
                }
                const users = data ? JSON.parse(data) : [];

                const existingUser = users.find((existingUser: User) => existingUser.email === user.email);

                if (existingUser) {
                    reject(new Conflict('User with the same email already exists'));
                } 
                else
                {
                    users.push(user);
                    try {
                        await fs.promises.writeFile(this._users, JSON.stringify(users));
                        resolve();
                    } catch (writeError) {
                        reject(new Error('DB Writing Error'));
                    }
                }
            });
        });
    }


}
  
module.exports = UsersRepository;