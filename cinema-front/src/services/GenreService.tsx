import axios from 'axios';
import { environment } from '../env/enviroment';
import { Genre } from '../models/Genre';
import { ApiService } from './ApiService';

export class GenreService {

  private apiService = new ApiService();

  async getAllGenres(): Promise<Genre[]> {
    return this.apiService.get<Genre[]>(`${environment.apiHost}/genres`);
  }

  async addGenre(genreData: Genre): Promise<Genre> {
    return this.apiService.post<Genre>(`${environment.apiHost}/genres`, genreData);
  }

  async editGenre(genreId: number, updatedGenreData: Genre): Promise<Genre> {
    return this.apiService.put<Genre>(`${environment.apiHost}/genres/${genreId}`, updatedGenreData);
  }

  async deleteGenre(genreId: number): Promise<void> {
    return this.apiService.delete(`${environment.apiHost}/genres/${genreId}`);
  }
}