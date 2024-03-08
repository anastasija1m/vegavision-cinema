import { Genre } from "./Genre";

export interface MovieGet {
  duration: number;
  genres: Genre[];
  id: number;
  name: string;
  originalName: string;
  posterUrl: string;
}