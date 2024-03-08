import { MovieGet } from "./MovieGet";

export interface MovieScreeningGet {
  movieId: number;
  screeningDateTime: string;
  ticketPrice: number;
  rows: number;
  columns: number;
  movieGetDto: MovieGet;
}