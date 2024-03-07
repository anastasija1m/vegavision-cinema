export interface RegisteredUser {
  id: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  dateOfBirth: Date;
  blocked: boolean;
  username: string;
  isPasswordValid: boolean;
};