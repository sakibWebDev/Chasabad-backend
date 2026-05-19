import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { UserAuthService } from "./user.service";
import status from "http-status";
import { Request, Response } from "express";



const getMe = catchAsync(
    async (req: Request, res: Response) => {
        const user = req.user;
        const result = await UserAuthService.getMe(user);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "User profile fetched successfully",
            data: result,
        })
    }
)

export const UserRoutes = {
    getMe,
}