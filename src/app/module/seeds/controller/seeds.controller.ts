import { Request, Response } from 'express';
import SeedService from '../service/seeds.service';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';

// Create new seed
export const createSeed = catchAsync(async (req: Request, res: Response) => {
  // Parse data if coming from form-data
  let seedData;
  try {
    seedData = JSON.parse(req.body.data);
  } catch (e) {
    seedData = req.body;
  }
  
  const userId = req.user?.id;
  const result = await SeedService.createSeed(seedData, userId);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Seed created successfully",
    data: result,
  });
});

// Get all seeds with filters
export const getAllSeeds = catchAsync(async (req: Request, res: Response) => {
  const filters = req.query;
  const result = await SeedService.getAllSeeds(filters);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Seeds retrieved successfully",
    data: result.data,
    meta: result.pagination
  });
});

// Get single seed by ID
export const getSeedById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SeedService.getSeedById(id);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Seed retrieved successfully",
    data: result,
  });
});

// Update seed
export const updateSeed = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  // Parse update data
  let updateData;
  try {
    updateData = JSON.parse(req.body.data);
  } catch (e) {
    updateData = req.body;
  }
  
  const result = await SeedService.updateSeed(id, updateData);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Seed updated successfully",
    data: result,
  });
});

// Delete seed
export const deleteSeed = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SeedService.deleteSeed(id);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Seed deleted successfully",
    data: result,
  });
});

// Get seeds by category
// Controller
export const getSeedsByCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { category } = req.params;

    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || 20;

    const result = await SeedService.getSeedsByCategory(
      category as string ,
      skip,
      limit
    );

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Seeds retrieved successfully by category",
      data: result,
    });
  }
);

// Get featured seeds

export const getFeaturedSeeds = catchAsync(
  async (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 10;
      const skip = Number(req.query.skip) || 0;

    const result = await SeedService.getFeaturedSeeds(limit, skip );

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Featured seeds retrieved successfully",
      data: result,
    });
  }
);

// Search seeds
// Controller
export const searchSeeds = catchAsync(
  async (req: Request, res: Response) => {
    const { q } = req.query;

    if (!q) {
      return sendResponse(res, {
        httpStatusCode: 400,
        success: false,
        message: "Search keyword is required",
        data: null,
      });
    }

    const skip = Math.max(
      0,
      Number(req.query.skip) || 0
    );

    const limit = Math.max(
      1,
      Math.min(Number(req.query.limit) || 20, 50)
    );

    const result = await SeedService.searchSeeds(
      q as string,
      skip,
      limit
    );

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Search results retrieved successfully",
      data: result,
    });
  }
);
// Get seeds by difficulty
export const getSeedsByDifficulty = catchAsync(
  async (req: Request, res: Response) => {
    const { difficulty } = req.params;

    const page = Number(req.query.page) || 1;

    const limit = Math.max(
      1,
      Math.min(Number(req.query.limit) || 20, 50)
    );

    const result = await SeedService.getAllSeeds({
      difficulty: difficulty as any,
      page,
      limit,
    });

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Seeds retrieved successfully by difficulty",
      data: result.data,
      pagination: result.pagination,
    });
  }
);

// Get seeds by season
export const getSeedsBySeason = catchAsync(async (req: Request, res: Response) => {
  const { seasonId } = req.params;
  const { limit } = req.query;
  
  const result = await SeedService.getAllSeeds({
    season: seasonId as any,
    limit: Number(limit)
  });

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Seeds retrieved successfully by season",
    data: result.data,
  });
});

// Get statistics
// Controller
export const getStatistics = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SeedService.getStatistics();

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Statistics retrieved successfully",
      data: result,
    });
  }
);