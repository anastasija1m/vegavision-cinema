import { ApiService } from './ApiService';
import { Registration } from '../models/Registration';
import { Login } from '../models/Login';
import { PasswordChangeViaProfile } from '../models/PasswordChangeViaProfile';
import { PasswordChangeViaEmail } from '../models/PasswordChangeViaEmail';
import { environment } from '../env/enviroment';

export class UserService {
  private static apiService = new ApiService();

  static async register(registrationData: Registration): Promise<any> { 
    return this.apiService.post(`${environment.apiHost}/user-management/register`, registrationData, false);
  }

  static async login(loginData: Login): Promise<any> {
    return this.apiService.post(`${environment.apiHost}/user-management/login`, loginData, false);
  }

  static async resetPasswordByUser(email: string): Promise<any> {
    return this.apiService.get(`${environment.apiHost}/users/reset-password-user?email=${email}`);
  }

  static async resetPasswordByAdmin(id: number): Promise<any> {
    return this.apiService.get(`${environment.apiHost}/users/${id}/reset-password-admin`);
  }

  static async findAll(page: number, size: number): Promise<any> {
    return this.apiService.get(`${environment.apiHost}/users?page=${page}&size=${size}`);
  }

  static async blockUser(userId: number): Promise<any> {
    return this.apiService.post(`${environment.apiHost}/users/${userId}/block`, null);
  }

  static async findById(userId: number): Promise<any> { 
    return this.apiService.get(`${environment.apiHost}/users/${userId}`);
  }

  static async changePasswordViaProfile(userId: number, passwordChangeData: PasswordChangeViaProfile): Promise<any> {
    return this.apiService.put(`${environment.apiHost}/users/${userId}/change-password-via-profile`, passwordChangeData);
  }

  static async changePasswordViaEmail(passwordChangeData: PasswordChangeViaEmail): Promise<any> {
    return this.apiService.post(`${environment.apiHost}/users/change-password`, passwordChangeData);
  }

  static async confirmAccount(token: string): Promise<any> {
    const response = await this.apiService.get(`${environment.apiHost}/user-management/confirm-account?token=${token}`);
    return response;
  }
}