import { ReservedSeat } from "./ReservedSeat";

export interface ReservationGet {
  id?: number;
  userEmail: string;
  screeningId: number;
  totalPrice: number;
  reservedSeats: ReservedSeat[];
  discountPercent: number;
  cancelled: boolean;
}