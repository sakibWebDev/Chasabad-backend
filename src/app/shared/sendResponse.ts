import { Response } from "express";



export type IResponseData<T> = {
 httpStatusCode: number;
    success: boolean;
    message: string;
    data?: T;

  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};


export const sendResponse = <T>(res: Response, responseData: IResponseData<T>) => {
    const { httpStatusCode, success, message, data } = responseData;

    res.status(httpStatusCode).json({
        success,
        message,
        data
    });
}