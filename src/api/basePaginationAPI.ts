export { default as axiosInstance } from './axios';
import { AxiosRequestConfig } from 'axios';
import axiosInstance from './axios';
import { IPaginatedResponse } from '@/types/api';

export interface IPaginatedAPI {
  get<T>(
    url: string,
    input?: object,
    options?: AxiosRequestConfig<T>,
  ): Promise<IPaginatedResponse<T>>;
  post<T>(
    url: string,
    input: object,
    options?: AxiosRequestConfig<T>,
  ): Promise<IPaginatedResponse<T>>;
  put<T>(
    url: string,
    input: object,
    options?: AxiosRequestConfig<T>,
  ): Promise<IPaginatedResponse<T>>;
  patch<T>(
    url: string,
    input: object,
    options?: AxiosRequestConfig<T>,
  ): Promise<IPaginatedResponse<T>>;
  delete<T>(
    url: string,
    input?: object,
    options?: AxiosRequestConfig<T>,
  ): Promise<IPaginatedResponse<T>>;
}

export class BasePaginatedAPI implements IPaginatedAPI {
  public async getList<T>(
    url: string,
    params?: object,
    options?: AxiosRequestConfig<T>,
  ): Promise<IPaginatedResponse<T>> {
    let opts: AxiosRequestConfig = { ...(options || {}) };

    let queryContent = '';
    if (Object.keys(params || {})?.length) {
      queryContent = Object.entries(params || {})
        .map(([key, value]) => {
          if (value != undefined) {
            return `${key}=${value}`;
          }
          return '';
        })
        .filter(Boolean)
        .join('&');
    }
    const { data } = await axiosInstance.get(`${url}?${queryContent}`, opts);

    return {
      items: data.items,
      total: data.total,
      limit: data.limit,
      page: data.page,
      total_pages: data.total_pages,
    };
  }
  public async get<T>(
    url: string,
    options?: AxiosRequestConfig<T>,
  ): Promise<IPaginatedResponse<T>> {
    let opts = { ...(options || {}) };

    return axiosInstance.get(url, opts);
  }

  public async post<T>(
    url: string,
    input?: object,
    options?: object,
  ): Promise<IPaginatedResponse<T>> {
    return axiosInstance.post(url, input, options);
  }

  public async patch<T>(
    url: string,
    input?: object,
    options?: object,
  ): Promise<IPaginatedResponse<T>> {
    return axiosInstance.patch(url, input, options);
  }

  public async put<T>(
    url: string,
    input?: object,
    options?: object,
  ): Promise<IPaginatedResponse<T>> {
    return axiosInstance.put(url, input, options);
  }

  public async delete<T>(url: string, input?: object): Promise<IPaginatedResponse<T>> {
    return axiosInstance.delete(url, input);
  }
}
