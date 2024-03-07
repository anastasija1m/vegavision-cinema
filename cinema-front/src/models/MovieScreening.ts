export interface MovieScreening {
  id?: number;
  ticketPrice: number;
  screeningDateTime: Date;
  rows: number;
  columns: number;
  movieId: number;
}