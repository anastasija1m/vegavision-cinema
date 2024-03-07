import { Genre } from "./Genre";

export interface Movie {
  id?: number;
  posterUrl: string;
  name: string;
  originalName: string;
  duration: number;
  genres?: Genre[];
};