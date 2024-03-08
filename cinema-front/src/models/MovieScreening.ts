import { Movie } from "./Movie";

export interface MovieScreening {
  id?: number;
  ticketPrice: number;
  screeningDateTime: Date;
  rows: number;
  columns: number;
  movieId: number;
  movie?: Movie;
}