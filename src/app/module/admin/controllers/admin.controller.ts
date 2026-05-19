// controllers/admin/admin.user.controller.ts

import { Response,  } from "express";
import status from "http-status";
import {AdminUserService } from "../services/admin.service";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { IRequestUser } from "../types";


export const getUsers = catchAsync(
  async (req: IRequestUser, res: Response) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const result = await AdminUserService.getUsers(page, limit, {});
   
    sendResponse(res, {
     httpStatusCode: status.OK,
      success: true,
      message: "Users fetched successfully",
      data: result,
    });
  }
);

export const getUserById = catchAsync(
  async (req: IRequestUser, res: Response) => {
   
    const id = req.params.id as string;

    const result =
      await AdminUserService.getUserById(id);

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "User fetched successfully",
      data: result,
    });
  }
);

 export const updateUser = catchAsync(
  async (req: IRequestUser, res: Response) => {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const result = await AdminUserService.updateUser(id, req.body);

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "User updated successfully",
      data: result,
    });
  }
);

export const deleteUser = catchAsync(
  async (req: IRequestUser, res: Response) => {
    const { id } = req.params as { id: string };

    const result =
      await AdminUserService.deleteUser(id);

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "User deleted successfully",
      data: result,
    });
  }
);

export const updateUserStatus = catchAsync(
  async (req: IRequestUser, res: Response) => {
    const { id } = req.params as { id: string };
    const { status: userStatus } = req.body;

    const result =
      await AdminUserService.updateUserStatus(
        id,
        userStatus
      );

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message:
        "User status updated successfully",
      data: result,
    });
  }
);

const createUser = catchAsync(
  async (req, res: Response) => {
    const result = await AdminUserService.createUser(req.body);
    console.log("Created user:", req.body);

    sendResponse(res, {
      httpStatusCode: status.CREATED,
      success: true,
      message: "User created successfully",
      data: result,
    });
  }
);

// ================= CONTROLLER =================

export const updatedUser = catchAsync(
  async (req, res) => {
    const result =
      await AdminUserService.updateUser(
        req.params.id as string,
        req.body
      );

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message:
        "User updated successfully",
      data: result,
    });
  }
);


export const AdminController = {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    updateUserStatus,
    createUser,
    updatedUser
};