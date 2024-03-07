import { environment } from '../env/enviroment';
import { Reservation } from '../models/Reservation';
import { ReservedSeat } from '../models/ReservedSeat';
import { ApiService } from './ApiService';

export class ReservationService {
  private apiService = new ApiService();

  async reserve(reservation: Reservation): Promise<any> {
    return this.apiService.post(`${environment.apiHost}/reservations`, reservation);
  }

  async getAllReservedSeatsForScreening(screeningId: number): Promise<ReservedSeat[]> {
    return this.apiService.get<ReservedSeat[]>(`${environment.apiHost}/reservations/${screeningId}/reserved`);
  }
}