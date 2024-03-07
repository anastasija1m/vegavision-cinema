import { User } from "../models/User";

export function saveAccessToken(token: string): void {
  localStorage.setItem('accessToken', token);
}

export function saveUserData(userData: User): void {
  localStorage.setItem('userData', JSON.stringify(userData));
}

export function getUserData(): User | null {
  const userDataString = localStorage.getItem('userData');
  if (userDataString) {
    try {
      const userData = JSON.parse(userDataString);
      return userData;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  return null;
}

export function handleLogOut() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userData');
}