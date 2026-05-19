import { Request, Response } from 'express';
import { SeasonService } from '../service/season.service';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';

export const createSeason = catchAsync(async (req: Request, res: Response) => {
  const result = await SeasonService.createSeason(req.body);
  
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Season created successfully",
    data: result
  });
});

export const getAllSeasons = catchAsync(async (req: Request, res: Response) => {
  const result = await SeasonService.getAllSeasons();
  
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Seasons retrieved successfully",
    data: result
  });
});

export const getSeasonById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SeasonService.getSeasonById(id);
  
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Season retrieved successfully",
    data: result
  });
});