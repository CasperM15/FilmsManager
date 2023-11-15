import { FavouriteFilm, Film } from "../domain/models/film";
import { IFilmsService } from "../domain/services/films-service";
import { IFavouritesRepository } from '../data-access/repository/favourites-repository';
import { BadRequest } from "../domain/errors/errors";
import { FavouriteFilmRequest } from "../domain/models/DTO/favourite-film-request";

const FilmsService  = require("../domain/services/films-service");
const FavouritesRepository  = require("../data-access/repository/favourites-repository");

require('dotenv').config();

export interface  IFilmsLogic {
  getAll(keyword?: string): Promise<Film[]>;
  get(id: number): Promise<Film>;
  addFavourite(request: FavouriteFilmRequest, email: string): Promise<void>;
  getFavourites(email: string):  Promise<Film[]>;
};

class FilmsLogic implements IFilmsLogic {
    _filmsService: IFilmsService;
    _favouritesRepository: IFavouritesRepository;

    constructor() 
    {
        this._filmsService = new FilmsService();
        this._favouritesRepository = new FavouritesRepository();
    }
  
    async getAll(keyword?: string): Promise<Film[]> {
        let films: Film[];
        if (keyword)
            films = await this._filmsService.getByKeyword(keyword);
        else
            films = await this._filmsService.getAll();
        const filmsWithScore = films.map(film => ({
            ...film,
            suggestionScore: this.getRandomScore(),
        }))
        const result = filmsWithScore.sort((a, b) => b.suggestionScore - a.suggestionScore);
        return result;
    }

    async get(id: number): Promise<Film>{
        const film: Film = await this._filmsService.get(id);
        film.suggestionScore = this.getRandomScore();
        return film;
    }

    async addFavourite(request: FavouriteFilmRequest, email: string): Promise<void> {
        const id: number = request.id;
        if (id)
        {
            const film: Film = await this._filmsService.get(id);
            const favouriteFilm: FavouriteFilm = {
                adult: film.adult,
                backdrop_path: film.backdrop_path,
                homepage: film.homepage,
                id: film.id,
                imdb_id: film.imdb_id,
                original_language: film.original_language,
                original_title: film.original_title,
                overview: film.overview,
                popularity: film.popularity,
                poster_path: film.poster_path,
                release_date: film.release_date,
                runtime: film.runtime,
                status: film.status,
                tagline: film.tagline,
                title: film.title,
                video: film.video,
                vote_average: film.vote_average,
                vote_count: film.vote_count,
                suggestionForTodayScore: this.getRandomScore(),
                user: email            
            }
            await this._favouritesRepository.save(favouriteFilm);
        }
        else
        {
            throw new BadRequest("Missing film id")
        }
    }

    async getFavourites(user: string): Promise<Film[]> {
        const favourites: FavouriteFilm[] = await this._favouritesRepository.getByUser(user);
        const result = favourites.sort((a, b) => b.suggestionForTodayScore - a.suggestionForTodayScore);
        return result;
    }

    private getRandomScore(): number {
        return Math.floor(Math.random() * 99) + 1;
    }
}
  
module.exports = FilmsLogic
