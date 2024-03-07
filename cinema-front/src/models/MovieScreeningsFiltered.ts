import { MovieScreening } from "./MovieScreening";

export interface MovieScreeningsFiltered {
  movieIds: number[];
  movieScreenings: MovieScreening[];
}