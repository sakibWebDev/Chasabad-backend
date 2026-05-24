import { Response } from 'express';

export interface IApiResponse<T> {
  httpStatusCode: number;
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const sendResponse = <T>(res: Response, data: IApiResponse<T>) => {
  const responseData: any = {
    success: data.success,
    httpStatusCode: data.httpStatusCode,
    message: data.message || "Success",
    data: data.data || null,
  };
  
  // Add meta if it exists
  if (data.meta) {
    responseData.meta = data.meta;
  }
  
  res.status(data.httpStatusCode).json(responseData);
};