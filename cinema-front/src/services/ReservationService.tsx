import { environment } from '../env/enviroment';
import { Reservation } from '../models/Reservation';
import { ReservedSeat } from '../models/ReservedSeat';
import { ApiService } from './ApiService';

export class ReservationService {
  private static apiService = new ApiService();

  static async reserve(reservation: Reservation): Promise<any> {
    return this.apiService.post(`${environment.apiHost}/reservations`, reservation);
  }

  static async getAllReservedSeatsForScreening(screeningId: number): Promise<ReservedSeat[]> {
    return this.apiService.get<ReservedSeat[]>(`${environment.apiHost}/reservations/${screeningId}/reserved`);
  }

  static async findAll(userId: number, page: number, size: number, type: string): Promise<any> {
    return this.apiService.get(`${environment.apiHost}/reservations/${userId}?page=${page}&size=${size}&type=${type}`);
  }

  static async cancelReservation(reservationId: number): Promise<any> {
    return this.apiService.post(`${environment.apiHost}/reservations/${reservationId}/cancel`, {});
  }
}