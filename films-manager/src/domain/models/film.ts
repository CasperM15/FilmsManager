export interface Film {
    adult: boolean;
    backdrop_path: string;
    homepage: string;
    id: number;
    imdb_id: string;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    runtime: number;
    status: string;
    tagline: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    suggestionScore?: number;
}

export interface FavouriteFilm extends Film{
    user: string;
    suggestionForTodayScore: number;
};