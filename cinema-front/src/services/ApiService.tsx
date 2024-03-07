import axios, { AxiosRequestConfig } from 'axios';

export class ApiService {
  async get<T>(url: string, includeToken: boolean = true): Promise<T> {
    try {
      const userData = includeToken ? localStorage.getItem('accessToken') : null;
      const config: AxiosRequestConfig = {
        headers: includeToken ? { authorization: `Bearer ${userData}` } : {}
      };

      const response = await axios.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch data from ${url}. Please try again later.`);
    }
  }

  async post<T>(url: string, data: any, includeToken: boolean = true): Promise<T> {
    try {
      const userData = includeToken ? localStorage.getItem('accessToken') : null;
      const config: AxiosRequestConfig = {
        headers: includeToken ? { authorization: `Bearer ${userData}` } : {}
      };

      const response = await axios.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to add data to ${url}. Please try again later.`);
    }
  }

  async put<T>(url: string, data: any, includeToken: boolean = true): Promise<T> {
    try {
      const userData = includeToken ? localStorage.getItem('accessToken') : null;
      const config: AxiosRequestConfig = {
        headers: includeToken ? { authorization: `Bearer ${userData}` } : {}
      };

      const response = await axios.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to edit data at ${url}. Please try again later.`);
    }
  }

  async delete(url: string, includeToken: boolean = true): Promise<void> {
    try {
      const userData = localStorage.getItem('accessToken');
      const config: AxiosRequestConfig = {
        headers: includeToken ? { authorization: `Bearer ${userData}` } : {}
      };

      await axios.delete(url, config);
    } catch (error) {
      throw new Error(`Failed to delete data at ${url}. Please try again later.`);
    }
  }
}
