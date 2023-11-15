import { NotFound } from '../errors/errors';
import { Film } from '../models/film';

require('dotenv').config();

export interface  IFilmsService {
  getAll(): Promise<Film[]>;
  getByKeyword(keyword: string): Promise<Film[]>;
  get(id: number): Promise<Film>;
};

class FilmsService implements IFilmsService {
  _baseUrl: string | undefined = process.env.URL_TMDB;

  constructor() {}
  
  async getAll(): Promise<Film[]>{
    console.log('all')
    const url = `${this._baseUrl}/movie/top_rated?api_key=${process.env.API_KEY}`;
    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    };
    const response = await fetch(url, options);
    if (response.ok) {
      const apiResponse: any = await response.json();
      const films: Film[] = apiResponse.results;
      return films;
    } else {
      throw new Error();
    }
  }

  async getByKeyword(keyword: string): Promise<Film[]>{
    const url = `${this._baseUrl}/search/movie?include_adult=false&language=en-US&page=1&api_key=${process.env.API_KEY}&query=${keyword}`;
    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    };
    const response = await fetch(url, options);
    if (response.ok) {
      const apiResponse: any = await response.json();
      const films: Film[] = apiResponse.results;
      return films;
    } else {
      throw new Error();
    }
  }

  async get(id: number): Promise<Film>{
    const url = `${process.env.URL_TMDB}/movie/${id}?language=en-US&api_key=${process.env.API_KEY}`;
    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    };
    const response = await fetch(url, options);
    if (response.ok) {
        const data: Film = await response.json();
        return data;
    } 
    else if (response.status === 404){
      throw new NotFound('Film Not Found');
    }
    else {
      throw new Error(`Failed to fetch data from TMDB. Status: ${response.status}`);
    }
  }
}
  
module.exports = FilmsService
