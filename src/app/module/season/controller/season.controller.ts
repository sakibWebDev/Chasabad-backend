// // controllers/season.controller.ts
// import { Request, Response } from 'express';
// import { SeasonService } from '../service/season.service';
// import { catchAsync } from '../../../shared/catchAsync';
// import { sendResponse } from '../../../shared/sendResponse';

// // Helper function to get string param
// const getStringParam = (param: string | string[] | undefined): string | null => {
//   if (!param) return null;
//   return Array.isArray(param) ? param[0] : param;
// };

// export const createSeason = catchAsync(async (req: Request, res: Response) => {
//   const result = await SeasonService.createSeason(req.body);
  
//   sendResponse(res, {
//     httpStatusCode: 201,
//     success: true,
//     message: "Season created successfully",
//     data: result
//   });
// });

// export const getAllSeasons = catchAsync(async (req: Request, res: Response) => {
//   const page = parseInt(req.query.page as string) || 1;
//   const limit = parseInt(req.query.limit as string) || 10;
  
//   const result = await SeasonService.getSeasonsPaginated(page, limit);
  
//   sendResponse(res, {
//     httpStatusCode: 200,
//     success: true,
//     message: "Seasons retrieved successfully",
//     data: result.data,
//     meta: result.meta
//   });
// });

// export const getSeasonById = catchAsync(async (req: Request, res: Response) => {
//   // FIX: Handle string | string[] type
//   const id = getStringParam(req.params.id);
  
//   if (!id) {
//     return sendResponse(res, {
//       httpStatusCode: 400,
//       success: false,
//       message: "Season ID is required",
//       data: null
//     });
//   }
  
//   const result = await SeasonService.getSeasonById(id);
  
//   sendResponse(res, {
//     httpStatusCode: 200,
//     success: true,
//     message: "Season retrieved successfully",
//     data: result
//   });
// });

// export const updateSeason = catchAsync(async (req: Request, res: Response) => {
//   const id = getStringParam(req.params.id);
  
//   if (!id) {
//     return sendResponse(res, {
//       httpStatusCode: 400,
//       success: false,
//       message: "Season ID is required",
//       data: null
//     });
//   }
  
//   const result = await SeasonService.updateSeason(id, req.body);
  
//   sendResponse(res, {
//     httpStatusCode: 200,
//     success: true,
//     message: "Season updated successfully",
//     data: result
//   });
// });

// export const deleteSeason = catchAsync(async (req: Request, res: Response) => {
//   const id = getStringParam(req.params.id);
  
//   if (!id) {
//     return sendResponse(res, {
//       httpStatusCode: 400,
//       success: false,
//       message: "Season ID is required",
//       data: null
//     });
//   }
  
//   await SeasonService.deleteSeason(id);
  
//   sendResponse(res, {
//     httpStatusCode: 200,
//     success: true,
//     message: "Season deleted successfully",
//     data: null
//   });
// });