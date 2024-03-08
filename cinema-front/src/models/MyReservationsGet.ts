import { MovieScreeningGet } from "./MovieScreeningsGet";
import { ReservedSeat } from "./ReservedSeat";

export interface MyReservationsGet {
  cancelled: boolean;
  code: string;
  discountPercent: number;
  id: number;
  movieScreeningGetDto: MovieScreeningGet;
  reservedSeats: ReservedSeat[];
  screeningId: number;
  totalPrice: number;
  userEmail: string;
}