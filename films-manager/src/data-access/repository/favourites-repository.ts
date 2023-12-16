
import * as path from 'path';
import { FavouriteFilm, Film } from '../../domain/models/film';
import { Conflict } from '../../domain/errors/errors';
const fs = require('fs');

export interface IFavouritesRepository {
    save(film: Film): Promise<void>;
    getByUser(email: string): Promise<FavouriteFilm[]>;
}

class FavouritesRepository implements IFavouritesRepository {
    _favourites: string 

    constructor() {
      this._favourites = path.resolve(__dirname, '..', '..', '..', 'collections', 'favourites.txt');
    }
  
    save(favouriteFilm: FavouriteFilm): Promise<void> {
      return new Promise((resolve, reject) => { 
        fs.readFile(this._favourites, 'utf8', async (err: any, data: any) => {
          if (err) {
            reject(new Error('DB Access Error'));
          }
          const favourites = data ? JSON.parse(data) : [];

          const existingFilm = favourites.find((existingFilm: FavouriteFilm) => existingFilm.id === favouriteFilm.id 
            && existingFilm.user === favouriteFilm.user);

          if (existingFilm) {
              reject(new Conflict('Film already added to favourites'));
          } 
          else
          {         
            favourites.push(favouriteFilm);
            try {
              await fs.promises.writeFile(this._favourites, JSON.stringify(favourites));
              resolve();
            }
            catch (writeError) {
              reject(new Error('DB Writing Error'));
            }
          }
        });
      });
    }

    getByUser(email: string): Promise<FavouriteFilm[]> {
      return new Promise((resolve, reject) => {
        fs.readFile(this._favourites, 'utf8', (err: any, data: any) => {
          if (err) {
            reject(new Error('DB Access Error'));
          } else {
            const allFavourites: FavouriteFilm[] = data ? JSON.parse(data) : [];
            const favouritesByUser: FavouriteFilm[] = allFavourites.filter(favourite => favourite.user === email);
            const favourites: FavouriteFilm[] = favouritesByUser.map(favourite => {
              const { user, ...filmWithoutUser } = favourite;
              return filmWithoutUser as FavouriteFilm;
          });
            resolve(favourites);
          }
        });
      });
    }
  }
  
  module.exports = FavouritesRepository;