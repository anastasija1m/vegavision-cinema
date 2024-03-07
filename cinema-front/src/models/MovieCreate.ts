export interface MovieCreate {
  id?: number;
  posterUrl: string;
  name: string;
  originalName: string;
  duration: number;
  genreIds?: number[];
};