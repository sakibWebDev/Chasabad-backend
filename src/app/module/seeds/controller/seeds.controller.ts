import { Request, Response } from 'express';
import SeedService from '../service/seeds.service';
import { catchAsync } from '../../../shared/catchAsync';
import { seedsSendResponse } from '../../../shared/seedssendResponse';

// Create new seed
export const createSeed = catchAsync(async (req: Request, res: Response) => {
  let seedData;
  try {
    seedData = JSON.parse(req.body.data);
  } catch (e) {
    seedData = req.body;
  }
  
  const userId = (req.user as { id?: string })?.id;
  const result = await SeedService.createSeed(seedData, userId);

  seedsSendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Seed created successfully",
    data: result,
  });
});

// Get all seeds with filters
export const getAllSeeds = catchAsync(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 12));
  const category = req.query.category as string;
  const difficulty = req.query.difficulty as string;
  const season = req.query.season_id as string;
  const search = req.query.search as string;
  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
  const organic = req.query.organic === 'true';
  const sortBy = (req.query.sortBy as string) || 'createdAt';
  const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

  const result = await SeedService.getAllSeeds({
    page,
    limit,
    category,
    difficulty,
    season,
    search,
    minPrice,
    maxPrice,
    organic,
    sortBy,
    sortOrder
  });

  // Create pagination meta from result
  const paginationMeta = {
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages,
    hasNextPage: result.page < result.totalPages,
    hasPrevPage: result.page > 1
  };

  seedsSendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Seeds retrieved successfully",
    data: result.data,
    meta: paginationMeta
  });
});

// Get single seed by ID
export const getSeedById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const result = await SeedService.getSeedById(id);

  seedsSendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Seed retrieved successfully",
    data: result,
  });
});

// Update seed
export const updateSeed = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  
  let updateData;
  try {
    updateData = JSON.parse(req.body.data);
  } catch (e) {
    updateData = req.body;
  }
  
  const result = await SeedService.updateSeed(id, updateData);

  seedsSendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Seed updated successfully",
    data: result,
  });
});

// Delete seed
export const deleteSeed = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const result = await SeedService.deleteSeed(id);

  seedsSendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Seed deleted successfully",
    data: result,
  });
});

// Get seeds by category
export const getSeedsByCategory = catchAsync(async (req: Request, res: Response) => {
  const { category } = req.params as { category: string };
  const skip = Number(req.query.skip) || 0;
  const limit = Math.min(50, Number(req.query.limit) || 20);

  const result = await SeedService.getSeedsByCategory(category, skip, limit);

  seedsSendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Seeds retrieved successfully by category",
    data: result,
  });
});

// Get featured seeds
export const getFeaturedSeeds = catchAsync(async (req: Request, res: Response) => {
  const limit = Math.min(50, Number(req.query.limit) || 10);
  const skip = Number(req.query.skip) || 0;

  const result = await SeedService.getFeaturedSeeds(limit, skip);

  seedsSendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Featured seeds retrieved successfully",
    data: result,
  });
});

// Search seeds
export const searchSeeds = catchAsync(async (req: Request, res: Response) => {
  const { q } = req.query;

  if (!q) {
    return seedsSendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Search keyword is required",
      data: null,
    });
  }

  const skip = Math.max(0, Number(req.query.skip) || 0);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));

  const result = await SeedService.searchSeeds(q as string, skip, limit);

  seedsSendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Search results retrieved successfully",
    data: result,
  });
});

// Get seeds by difficulty
export const getSeedsByDifficulty = catchAsync(async (req: Request, res: Response) => {
  const { difficulty } = req.params as { difficulty: 'EASY' | 'MEDIUM' | 'HARD' };
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));

  const result = await SeedService.getAllSeeds({
    difficulty: difficulty,
    page,
    limit,
  });

  const paginationMeta = {
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages,
    hasNextPage: result.page < result.totalPages,
    hasPrevPage: result.page > 1
  };

  seedsSendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Seeds retrieved successfully by difficulty",
    data: result.data,
    meta: paginationMeta
  });
});

// Get seeds by season
export const getSeedsBySeason = catchAsync(async (req: Request, res: Response) => {
  const { seasonId } = req.params as { seasonId: string };
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 12));
  
  const result = await SeedService.getAllSeeds({
    season: seasonId,
    page,
    limit
  });

  const paginationMeta = {
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages,
    hasNextPage: result.page < result.totalPages,
    hasPrevPage: result.page > 1
  };

  seedsSendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Seeds retrieved successfully by season",
    data: result.data,
    meta: paginationMeta
  });
});

// Get statistics
export const getStatistics = catchAsync(async (req: Request, res: Response) => {
  const result = await SeedService.getStatistics();

  seedsSendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Statistics retrieved successfully",
    data: result,
  });
});

// seeds.controller.ts - এড করুন

export const getAllCounts = catchAsync(async (req: Request, res: Response) => {
  const result = await SeedService.getAllCounts();

  seedsSendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All counts retrieved successfully",
    data: result,
  });
});