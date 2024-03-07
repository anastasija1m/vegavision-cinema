import axios from 'axios';
import { environment } from '../env/enviroment';
import { Movie } from '../models/Movie';
import { MovieCreate } from '../models/MovieCreate';
import { ApiService } from './ApiService';

export class MovieService {

  private apiService = new ApiService();

  async getAllMovies(): Promise<Movie[]> {
    return this.apiService.get<Movie[]>(`${environment.apiHost}/movies`, false);
  }

  async addMovie(movieData: MovieCreate): Promise<Movie> {
    return this.apiService.post<Movie>(`${environment.apiHost}/movies`, movieData);
  }

  async editMovie(movieId: number, updatedMovieData: MovieCreate): Promise<Movie> {
    return this.apiService.put<Movie>(`${environment.apiHost}/movies/${movieId}`, updatedMovieData);
  }

  async deleteMovie(movieId: number): Promise<void> {
    return this.apiService.delete(`${environment.apiHost}/movies/${movieId}`);
  }

  async fetchMoviesByIds(movieIds: number[]): Promise<Movie[]> {
    try {
      const response = await axios.post<Movie[]>(`${environment.apiHost}/movies/fetch-by-ids`, movieIds);
      return response.data;
    } catch (error: any) {
      throw new Error('Error fetching movies by IDs: ' + error.message);
    }
  }
}