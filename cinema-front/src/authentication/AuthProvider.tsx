import { jwtDecode } from 'jwt-decode'
import { User } from '../models/User';

export default function decodeToken(token: string): User | null {
  try {
    const decoded = jwtDecode(token) as User;
    return decoded;
  } catch (error) {
    console.error('Error decoding token: ', error);
    return null;
  }
}