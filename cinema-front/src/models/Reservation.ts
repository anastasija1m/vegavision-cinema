import { ReservedSeat } from "./ReservedSeat";

export interface Reservation {
  id?: number;
  userEmail: string;
  screeningId: number;
  totalPrice: number;
  reservedSeats: ReservedSeat[];
}