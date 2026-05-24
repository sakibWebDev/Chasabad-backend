
import { Response } from 'express';  // Make sure this is imported from express

export interface IApiResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
  };
}

export const seedsSendResponse = <T>(res: Response, data: IApiResponse<T>) => {
  const statusCode = data.statusCode || 500;
  
  const responseData: any = {
    success: data.success !== undefined ? data.success : true,
    statusCode: statusCode,
    message: data.message || "Success",
  };
  
  if (data.data !== undefined && data.data !== null) {
    responseData.data = data.data;
  }
  
  if (data.meta) {
    responseData.meta = {
      total: data.meta.total,
      page: data.meta.page,
      limit: data.meta.limit,
      totalPages: data.meta.totalPages,
      hasNextPage: data.meta.hasNextPage !== undefined ? data.meta.hasNextPage : data.meta.page < data.meta.totalPages,
      hasPrevPage: data.meta.hasPrevPage !== undefined ? data.meta.hasPrevPage : data.meta.page > 1
    };
  }
  
  res.status(statusCode).json(responseData);
};

export const getPaginationMeta = (total: number, page: number, limit: number) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};