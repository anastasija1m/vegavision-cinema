import axios from 'axios';
import { environment } from '../env/enviroment';
import { MovieScreening } from '../models/MovieScreening';
import { ApiService } from './ApiService';
import { MovieScreeningsFiltered } from '../models/MovieScreeningsFiltered';

export class MovieScreeningService {

  private static apiService = new ApiService();

  static async findAll(page: number, size: number): Promise<any> {
    return this.apiService.get(`${environment.apiHost}/movie-screenings?page=${page}&size=${size}`);
  }

  static async addMovieScreening(movieScreeningData: MovieScreening): Promise<MovieScreening> {
    return this.apiService.post<MovieScreening>(`${environment.apiHost}/movie-screenings`, movieScreeningData);
  }

  static async editMovieScreening(movieScreeningId: number, updatedMovieScreeningData: MovieScreening): Promise<any> {
    console.log(updatedMovieScreeningData);
    return this.apiService.put<MovieScreening>(`${environment.apiHost}/movie-screenings/${movieScreeningId}`, updatedMovieScreeningData);
  }

  static async deleteMovieScreening(movieScreeningId: number): Promise<void> {
    return this.apiService.delete(`${environment.apiHost}/movie-screenings/${movieScreeningId}`);
  }

  static async findById(userId: number): Promise<MovieScreening> { 
    return this.apiService.get(`${environment.apiHost}/movie-screenings/${userId}`);
  }

  static async getAllFiltered(date?: string, genreIds?: number[]): Promise<MovieScreeningsFiltered> {
    const filterDate = date ? date : new Date().toISOString().split('T')[0];
    const genreQueryString = genreIds ? `&genreIds=${genreIds.join(',')}` : '';
    const url = `${environment.apiHost}/movie-screenings/get-all-filtered?date=${filterDate}${genreQueryString}`;
    try {
      const response = await axios.get<MovieScreeningsFiltered>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie screenings:', error);
      throw error;
    }
  }
}