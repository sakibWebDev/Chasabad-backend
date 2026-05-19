import { Request } from "express";

export interface IRequestUser extends Request {
  userId?: string;
  role?: "ADMIN" | "USER";
  email?: string;
}

export interface IUserQuery {
  page?: string;
  limit?: string;
}

export interface IUserMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IUserListResponse<T> {
  data: T[];
  meta: IUserMeta;
}