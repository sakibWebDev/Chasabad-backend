// interfaces/admin.interface.ts

export interface IPaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface IUserFilterQuery extends IPaginationQuery {
  role?: string;
}

export interface ISeedFilterQuery extends IPaginationQuery {
  category?: string;
  difficulty?: string;
}

export interface IOrderFilterQuery extends IPaginationQuery {
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface IUpdateUserStatus {
  status: string;
}

export interface IUpdateOrderStatus {
  status: string;
  tracking_number?: string;
  delivery_date?: string;
}

export interface ICancelOrder {
  cancellation_reason?: string;
}