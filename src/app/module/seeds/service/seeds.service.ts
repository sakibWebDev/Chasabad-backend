import { SunlightRequirement, WaterRequirement, Difficulty, SoilType } from "../../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";

export interface CreateSeedPayload {
  name: string;
  name_en?: string;
  scientific_name?: string;
  category: string;
  sub_category?: string;
  season_id: string;
  image?: string;
  image_gallery?: string[];
  video_url?: string;
  icon?: string;
  variety_type?: string;
  origin_country?: string;
  origin_region?: string;
  year_of_introduction?: number;
  germination_time?: string;
  germination_days?: number;
  maturity_time?: string;
  maturity_days?: number;
  spacing?: string;
  depth?: string;
  depth_cm?: number;
  sunlight?: SunlightRequirement;
  watering?: WaterRequirement;
  difficulty?: Difficulty;
  soil_type?: string;
  soil_type_enum?: SoilType;
  temperature?: string;
  temperature_min?: number;
  temperature_max?: number;
  rainfall?: string;
  rainfall_min_mm?: number;
  rainfall_max_mm?: number;
  ph_range?: string;
  ph_min?: number;
  ph_max?: number;
  altitude_range?: string;
  wind_tolerance?: string;
  yield_per_hectare?: string;
  yield_min_kg?: number;
  yield_max_kg?: number;
  harvest_method?: string;
  storage?: string;
  storage_days?: number;
  benefits?: string[];
  benefits_bn?: string[];
  precautions?: string[];
  precautions_bn?: string[];
  special_notes?: string;
  special_notes_bn?: string;
  nutritional_value?: any;
  medicinal_uses?: string[];
  commercial_uses?: string[];
  export_potential?: boolean;
  organic_certified?: boolean;
  market_price?: number;
  seed_cost?: number;
  expected_profit?: number;
  carbon_footprint?: number;
  water_footprint?: number;
  sustainable_practices?: string[];
}

export interface UpdateSeedPayload extends Partial<CreateSeedPayload> {}

interface GetAllSeedsResult {
  data: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class SeedService {
  private static generateSeedId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `SEED-${timestamp}-${random}`;
  }

  static async createSeed(payload: CreateSeedPayload, userId?: string) {
    const existingSeed = await prisma.seed.findFirst({
      where: { name: payload.name }
    });

    if (existingSeed) {
      throw new Error("Seed with this name already exists");
    }

    const seasonExists = await prisma.season.findUnique({
      where: { id: payload.season_id }
    });

    if (!seasonExists) {
      throw new Error("Season not found");
    }

    const seedId = this.generateSeedId();

    const newSeed = await prisma.seed.create({
      data: {
        seedId: seedId,
        name: payload.name,
        name_en: payload.name_en || "",
        scientific_name: payload.scientific_name || "",
        category: payload.category,
        sub_category: payload.sub_category,
        season_id: payload.season_id,
        image: payload.image || "",
        image_gallery: payload.image_gallery || [],
        video_url: payload.video_url,
        icon: payload.icon || "🌱",
        variety_type: payload.variety_type,
        origin_country: payload.origin_country || "বাংলাদেশ",
        origin_region: payload.origin_region,
        year_of_introduction: payload.year_of_introduction,
        germination_time: payload.germination_time || "",
        germination_days: payload.germination_days,
        maturity_time: payload.maturity_time || "",
        maturity_days: payload.maturity_days,
        spacing: payload.spacing || "",
        depth: payload.depth || "",
        depth_cm: payload.depth_cm,
        sunlight: payload.sunlight || "FULL_SUN",
        watering: payload.watering || "MODERATE",
        difficulty: payload.difficulty || "EASY",
        soil_type: payload.soil_type || "LOAMY",
        soil_type_enum: payload.soil_type_enum,
        temperature: payload.temperature || "",
        temperature_min: payload.temperature_min,
        temperature_max: payload.temperature_max,
        rainfall: payload.rainfall || "",
        rainfall_min_mm: payload.rainfall_min_mm,
        rainfall_max_mm: payload.rainfall_max_mm,
        ph_range: payload.ph_range || "",
        ph_min: payload.ph_min,
        ph_max: payload.ph_max,
        altitude_range: payload.altitude_range,
        wind_tolerance: payload.wind_tolerance,
        yield_per_hectare: payload.yield_per_hectare || "",
        yield_min_kg: payload.yield_min_kg,
        yield_max_kg: payload.yield_max_kg,
        harvest_method: payload.harvest_method || "",
        storage: payload.storage || "",
        storage_days: payload.storage_days,
        benefits: payload.benefits || [],
        benefits_bn: payload.benefits_bn || [],
        precautions: payload.precautions || [],
        precautions_bn: payload.precautions_bn || [],
        special_notes: payload.special_notes || "",
        special_notes_bn: payload.special_notes_bn || "",
        nutritional_value: payload.nutritional_value || {},
        medicinal_uses: payload.medicinal_uses || [],
        commercial_uses: payload.commercial_uses || [],
        export_potential: payload.export_potential || false,
        organic_certified: payload.organic_certified || false,
        market_price: payload.market_price,
        seed_cost: payload.seed_cost,
        expected_profit: payload.expected_profit,
        carbon_footprint: payload.carbon_footprint,
        water_footprint: payload.water_footprint,
        sustainable_practices: payload.sustainable_practices || []
      },
      include: {
        season: { select: { title: true, seasonCode: true } }
      }
    });

    return newSeed;
  }

  static async updateSeed(id: string, payload: UpdateSeedPayload) {
    const existingSeed = await prisma.seed.findUnique({ where: { id } });
    if (!existingSeed) throw new Error("Seed not found");

    if (payload.name && payload.name !== existingSeed.name) {
      const nameExists = await prisma.seed.findFirst({
        where: { name: payload.name, id: { not: id } }
      });
      if (nameExists) throw new Error("Seed with this name already exists");
    }

    if (payload.season_id && payload.season_id !== existingSeed.season_id) {
      const seasonExists = await prisma.season.findUnique({ where: { id: payload.season_id } });
      if (!seasonExists) throw new Error("Season not found");
    }

    const updatedSeed = await prisma.seed.update({
      where: { id },
      data: { ...payload },
      include: { season: { select: { title: true, seasonCode: true } } }
    });

    return updatedSeed;
  }

  static async deleteSeed(id: string) {
    const existingSeed = await prisma.seed.findUnique({ where: { id } });
    if (!existingSeed) throw new Error("Seed not found");

    await prisma.seed.delete({ where: { id } });
    return { message: "Seed deleted successfully", seedId: existingSeed.seedId };
  }

  static async getSeedById(id: string) {
    const seed = await prisma.seed.findUnique({
      where: { id },
      include: {
        season: { select: { title: true, title_en: true, seasonCode: true } }
      }
    });

    if (!seed) throw new Error("Seed not found");
    return seed;
  }

  static async getAllSeeds(filters: {
    page?: number;
    limit?: number;
    category?: string;
    difficulty?: string;
    season?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    organic?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<GetAllSeedsResult> {
    const {
      page = 1,
      limit = 12,
      category,
      difficulty,
      season,
      search,
      minPrice,
      maxPrice,
      organic,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;

    const skip = (page - 1) * limit;
    const where: any = {};

    if (category && category !== '') {
      where.category = category;
    }
    
    if (difficulty) {
      if (difficulty.includes(',')) {
        where.difficulty = { in: difficulty.split(',') };
      } else {
        where.difficulty = difficulty;
      }
    }
    
    if (season) {
      if (season.includes(',')) {
        where.season_id = { in: season.split(',') };
      } else {
        where.season_id = season;
      }
    }
    
    if (organic) {
      where.organic_certified = organic;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { name_en: { contains: search, mode: 'insensitive' } },
        { scientific_name: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.seed_cost = {};
      if (minPrice !== undefined && minPrice > 0) {
        where.seed_cost.gte = minPrice;
      }
      if (maxPrice !== undefined && maxPrice < 100000) {
        where.seed_cost.lte = maxPrice;
      }
    }

    const [seeds, total] = await Promise.all([
      prisma.seed.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          season: {
            select: {
              title: true,
              seasonCode: true
            }
          }
        }
      }),
      prisma.seed.count({ where })
    ]);

    return {
      data: seeds,
      total: total,
      page: page,
      limit: limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  static async getSeedsByCategory(category: string, skip: number = 0, limit: number = 20) {
    const seeds = await prisma.seed.findMany({
      where: { category },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { season: { select: { title: true } } }
    });
    return seeds;
  }

  static async getFeaturedSeeds(limit: number = 10, skip: number = 0) {
    const seeds = await prisma.seed.findMany({
      where: { organic_certified: true },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { season: { select: { title: true } } }
    });
    return seeds;
  }

  static async searchSeeds(keyword: string, skip: number = 0, limit: number = 20) {
    const seeds = await prisma.seed.findMany({
      where: {
        OR: [
          { name: { contains: keyword, mode: "insensitive" } },
          { name_en: { contains: keyword, mode: "insensitive" } },
          { scientific_name: { contains: keyword, mode: "insensitive" } },
          { category: { contains: keyword, mode: "insensitive" } }
        ]
      },
      skip,
      take: limit,
      orderBy: { name: "asc" }
    });
    return seeds;
  }

  static async getStatistics() {
    const [totalSeeds, organicSeeds, exportSeeds, categoryStats, difficultyStats] = await Promise.all([
      prisma.seed.count(),
      prisma.seed.count({ where: { organic_certified: true } }),
      prisma.seed.count({ where: { export_potential: true } }),
      prisma.seed.groupBy({ by: ["category"], _count: { category: true } }),
      prisma.seed.groupBy({ by: ["difficulty"], _count: { difficulty: true } })
    ]);

    return {
      total: totalSeeds,
      organic: organicSeeds,
      export: exportSeeds,
      byCategory: categoryStats,
      byDifficulty: difficultyStats
    };
  }

  // ============================================
  // GET ALL COUNTS METHOD (ADD THIS)
  // ============================================
  static async getAllCounts() {
    // সব ক্যাটাগরির কাউন্ট
    const categoryCounts = await prisma.seed.groupBy({
      by: ['category'],
      _count: {
        category: true
      }
    });

    // ডিফিকাল্টি ভিত্তিক কাউন্ট
    const difficultyCounts = await prisma.seed.groupBy({
      by: ['difficulty'],
      _count: {
        difficulty: true
      }
    });

    // সিজনের নাম সহ কাউন্ট
    const seasonsWithCounts = await prisma.season.findMany({
      select: {
        id: true,
        title: true,
        _count: {
          select: { seeds: true }
        }
      }
    });

    // মোট পণ্য কাউন্ট
    const totalProducts = await prisma.seed.count();
    
    // বীজ কাউন্ট (যেখানে category আছে)
    const seedsCount = await prisma.seed.count({
      where: {
        category: { not: '' }
      }
    });

    // চারা কাউন্ট
    const plantsCount = await prisma.seed.count({
      where: {
        category: 'চারা'
      }
    });

    // সরঞ্জাম কাউন্ট
    const toolsCount = await prisma.seed.count({
      where: {
        category: 'সরঞ্জাম'
      }
    });

    // ক্যাটাগরি ম্যাপিং
    const categoryMap: Record<string, number> = {
      'ধান': 0,
      'সবজি': 0,
      'ফল': 0,
      'ফুল': 0,
      'মসলা': 0,
      'তেলবীজ': 0,
      'ডাল': 0,
      'ঔষধি': 0
    };

    categoryCounts.forEach(item => {
      if (categoryMap.hasOwnProperty(item.category)) {
        categoryMap[item.category] = item._count.category;
      }
    });

    // ডিফিকাল্টি ম্যাপিং
    const difficultyMap: Record<string, number> = {
      'EASY': 0,
      'MEDIUM': 0,
      'HARD': 0
    };

    difficultyCounts.forEach(item => {
      if (difficultyMap.hasOwnProperty(item.difficulty)) {
        difficultyMap[item.difficulty] = item._count.difficulty;
      }
    });

    // সিজন ম্যাপিং
    const seasonMap = seasonsWithCounts.map(season => ({
      id: season.id,
      name: season.title,
      count: season._count.seeds
    }));

    return {
      categories: categoryMap,
      difficulties: difficultyMap,
      seasons: seasonMap,
      sidebar: {
        allProducts: totalProducts,
        seeds: seedsCount,
        plants: plantsCount,
        tools: toolsCount
      }
    };
  }
}

export default SeedService;