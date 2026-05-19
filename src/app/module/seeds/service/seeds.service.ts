import {SunlightRequirement, WaterRequirement , Difficulty, SoilType } from "../../../../generated/prisma/enums"
import { prisma } from "../../../lib/prisma";


export interface CreateSeedPayload {
  // বেসিক তথ্য
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
  
  // চাষ সংক্রান্ত
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
  
  // মাটি ও আবহাওয়া
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
  
  // ফলন ও সংরক্ষণ
  yield_per_hectare?: string;
  yield_min_kg?: number;
  yield_max_kg?: number;
  harvest_method?: string;
  storage?: string;
  storage_days?: number;
  
  // উপকারিতা ও সতর্কতা
  benefits?: string[];
  benefits_bn?: string[];
  precautions?: string[];
  precautions_bn?: string[];
  special_notes?: string;
  special_notes_bn?: string;
  nutritional_value?: any;
  medicinal_uses?: string[];
  commercial_uses?: string[];
  
  // সার্টিফিকেশন ও মূল্য
  export_potential?: boolean;
  organic_certified?: boolean;
  market_price?: number;
  seed_cost?: number;
  expected_profit?: number;
  
  // পরিবেশগত তথ্য
  carbon_footprint?: number;
  water_footprint?: number;
  sustainable_practices?: string[];
}

export interface UpdateSeedPayload extends Partial<CreateSeedPayload> {}

class SeedService {
  // Generate unique seed ID
  private static generateSeedId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `SEED-${timestamp}-${random}`;
  }

  // Create new seed
  static async createSeed(payload: CreateSeedPayload, userId?: string) {
    // 1. check if seed with same name exists
    const existingSeed = await prisma.seed.findFirst({
      where: {
        name: payload.name
      }
    });

    if (existingSeed) {
      throw new Error("Seed with this name already exists");
    }

    // 2. check if season exists
    const seasonExists = await prisma.season.findUnique({
      where: { id: payload.season_id }
    });

    if (!seasonExists) {
      throw new Error("Season not found");
    }

    // 3. generate unique seed ID
    const seedId = this.generateSeedId();

    // 4. create seed
    const newSeed = await prisma.seed.create({
      data: {
        seedId: seedId,
        name: payload.name,
        name_en: payload.name_en || "",
        scientific_name: payload.scientific_name || "",
        category: payload.category,
        sub_category: payload.sub_category,
        season_id: payload.season_id ,
        image: payload.image || "",
        image_gallery: payload.image_gallery || [],
        video_url: payload.video_url,
        icon: payload.icon || "",
        variety_type: payload.variety_type,
        origin_country: payload.origin_country || "বাংলাদেশ",
        origin_region: payload.origin_region,
        year_of_introduction: payload.year_of_introduction,
        
        // চাষ সংক্রান্ত
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
        
        // মাটি ও আবহাওয়া
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
        
        // ফলন ও সংরক্ষণ
        yield_per_hectare: payload.yield_per_hectare || "",
        yield_min_kg: payload.yield_min_kg,
        yield_max_kg: payload.yield_max_kg,
        harvest_method: payload.harvest_method || "",
        storage: payload.storage || "", 
        storage_days: payload.storage_days,
        
        // উপকারিতা ও সতর্কতা
        benefits: payload.benefits || [],
        benefits_bn: payload.benefits_bn || [],
        precautions: payload.precautions || [],
        precautions_bn: payload.precautions_bn || [],
        special_notes: payload.special_notes || "",
        special_notes_bn: payload.special_notes_bn || "",
        nutritional_value: payload.nutritional_value || "",
        medicinal_uses: payload.medicinal_uses || [],
        commercial_uses: payload.commercial_uses || [],
        
        // সার্টিফিকেশন ও মূল্য
        export_potential: payload.export_potential || false,
        organic_certified: payload.organic_certified || false,
        market_price: payload.market_price,
        seed_cost: payload.seed_cost,
        expected_profit: payload.expected_profit,
        
        // পরিবেশগত তথ্য
        carbon_footprint: payload.carbon_footprint,
        water_footprint: payload.water_footprint,
        sustainable_practices: payload.sustainable_practices || []
      },
      include: {
        season: {
          select: {
            title: true,
            seasonCode: true
          }
        }
      }
    });

    return newSeed;
  }

  // Update seed
  static async updateSeed(id: string, payload: UpdateSeedPayload) {
    // 1. check if seed exists
    const existingSeed = await prisma.seed.findUnique({
      where: { id }
    });

    if (!existingSeed) {
      throw new Error("Seed not found");
    }

    // 2. check if name is being changed and already exists
    if (payload.name && payload.name !== existingSeed.name) {
      const nameExists = await prisma.seed.findFirst({
        where: {
          name: payload.name,
          id: { not: id }
        }
      });

      if (nameExists) {
        throw new Error("Seed with this name already exists");
      }
    }

    // 3. check if season exists (if being changed)
    if (payload.season_id && payload.season_id !== existingSeed.season_id) {
      const seasonExists = await prisma.season.findUnique({
        where: { id: payload.season_id }
      });

      if (!seasonExists) {
        throw new Error("Season not found");
      }
    }

    // 4. update seed
    const updatedSeed = await prisma.seed.update({
      where: { id },
      data: {
        name: payload.name,
        name_en: payload.name_en,
        scientific_name: payload.scientific_name,
        category: payload.category,
        sub_category: payload.sub_category,
        season_id: payload.season_id,
        image: payload.image,
        image_gallery: payload.image_gallery,
        video_url: payload.video_url,
        icon: payload.icon,
        variety_type: payload.variety_type,
        origin_country: payload.origin_country,
        origin_region: payload.origin_region,
        year_of_introduction: payload.year_of_introduction,
        
        // চাষ সংক্রান্ত
        germination_time: payload.germination_time,
        germination_days: payload.germination_days,
        maturity_time: payload.maturity_time,
        maturity_days: payload.maturity_days,
        spacing: payload.spacing,
        depth: payload.depth,
        depth_cm: payload.depth_cm,
        sunlight: payload.sunlight,
        watering: payload.watering,
        difficulty: payload.difficulty,
        
        // মাটি ও আবহাওয়া
        soil_type: payload.soil_type,
        soil_type_enum: payload.soil_type_enum,
        temperature: payload.temperature,
        temperature_min: payload.temperature_min,
        temperature_max: payload.temperature_max,
        rainfall: payload.rainfall,
        rainfall_min_mm: payload.rainfall_min_mm,
        rainfall_max_mm: payload.rainfall_max_mm,
        ph_range: payload.ph_range,
        ph_min: payload.ph_min,
        ph_max: payload.ph_max,
        altitude_range: payload.altitude_range,
        wind_tolerance: payload.wind_tolerance,
        
        // ফলন ও সংরক্ষণ
        yield_per_hectare: payload.yield_per_hectare,
        yield_min_kg: payload.yield_min_kg,
        yield_max_kg: payload.yield_max_kg,
        harvest_method: payload.harvest_method,
        storage: payload.storage,
        storage_days: payload.storage_days,
        
        // উপকারিতা ও সতর্কতা
        benefits: payload.benefits,
        benefits_bn: payload.benefits_bn,
        precautions: payload.precautions,
        precautions_bn: payload.precautions_bn,
        special_notes: payload.special_notes,
        special_notes_bn: payload.special_notes_bn,
        nutritional_value: payload.nutritional_value,
        medicinal_uses: payload.medicinal_uses,
        commercial_uses: payload.commercial_uses,
        
        // সার্টিফিকেশন ও মূল্য
        export_potential: payload.export_potential,
        organic_certified: payload.organic_certified,
        market_price: payload.market_price,
        seed_cost: payload.seed_cost,
        expected_profit: payload.expected_profit,
        
        // পরিবেশগত তথ্য
        carbon_footprint: payload.carbon_footprint,
        water_footprint: payload.water_footprint,
        sustainable_practices: payload.sustainable_practices
      },
      include: {
        season: {
          select: {
            title: true,
            seasonCode: true
          }
        }
      }
    });

    return updatedSeed;
  }

  // Delete seed
  static async deleteSeed(id: string) {
    // 1. check if seed exists
    const existingSeed = await prisma.seed.findUnique({
      where: { id }
    });

    if (!existingSeed) {
      throw new Error("Seed not found");
    }

    // 2. delete seed
    await prisma.seed.delete({
      where: { id }
    });

    return { message: "Seed deleted successfully", seedId: existingSeed.seedId };
  }

  // Get single seed by ID
  static async getSeedById(id: string) {
    const seed = await prisma.seed.findUnique({
      where: { id },
      include: {
        season: {
          select: {
            title: true,
            title_en: true,
            seasonCode: true
          }
        },
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            rating: true,
            comment: true,
            comment_bn: true,
            user: {
              select: {
                name: true,
                image: true
              }
            }
          }
        },
        cultivationMethod: true,
        diseaseManagement: true,
        pestManagement: true
      }
    });

    if (!seed) {
      throw new Error("Seed not found");
    }

    return seed;
  }

  // Get all seeds with filters and pagination
  static async getAllSeeds(filters: {
    page?: number;
    limit?: number;
    category?: string;
    difficulty?: Difficulty;
    season?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    organic?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const {
      page = 1,
      limit = 10,
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

    // Apply filters
    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;
    if (season) where.season_id = season;
    if (organic) where.organic_certified = organic;
    
    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { name_en: { contains: search, mode: 'insensitive' } },
        { scientific_name: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Price filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.seed_cost = {};
      if (minPrice !== undefined) where.seed_cost.gte = minPrice;
      if (maxPrice !== undefined) where.seed_cost.lte = maxPrice;
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
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Get seeds by category
// Service
static async getSeedsByCategory(
  category: string,
  skip: number = 0,
  limit: number = 20
) {
  const seeds = await prisma.seed.findMany({
    where: {
      category,
    },

    skip,
    take: limit,

    orderBy: {
      createdAt: "desc",
    },

    include: {
      season: {
        select: {
          title: true,
        },
      },
    },
  });

  return seeds;
}

  // Get featured seeds
 static async getFeaturedSeeds(
  skip: number = 0,
  limit: number = 10
) {
  const seeds = await prisma.seed.findMany({
    where: {
      organic_certified: true,
    },

    skip,
    take: limit,

    orderBy: {
      createdAt: "desc",
    },

    include: {
      season: {
        select: {
          title: true,
        },
      },
    },
  });

  return seeds;
}
  // Search seeds
  // Service
static async searchSeeds(
  keyword: string,
  skip: number = 0,
  limit: number = 20
) {
  const seeds = await prisma.seed.findMany({
    where: {
      OR: [
        {
          name: {
            contains: keyword,
            mode: "insensitive",
          },
        },

        {
          name_en: {
            contains: keyword,
            mode: "insensitive",
          },
        },

        {
          scientific_name: {
            contains: keyword,
            mode: "insensitive",
          },
        },

        {
          category: {
            contains: keyword,
            mode: "insensitive",
          },
        },
      ],
    },

    skip,
    take: limit,

    orderBy: {
      name: "asc",
    },
  });

  return seeds;
}

  // Get statistics
  // Service
static async getStatistics() {
  const [
    totalSeeds,
    organicSeeds,
    exportSeeds,
    categoryStats,
    difficultyStats,
  ] = await Promise.all([
    prisma.seed.count(),

    prisma.seed.count({
      where: {
        organic_certified: true,
      },
    }),

    prisma.seed.count({
      where: {
        export_potential: true,
      },
    }),

    prisma.seed.groupBy({
      by: ["category"],
      _count: {
        category: true,
      },
    }),

    prisma.seed.groupBy({
      by: ["difficulty"],
      _count: {
        difficulty: true,
      },
    }),
  ]);

  return {
    total: totalSeeds,
    organic: organicSeeds,
    export: exportSeeds,
    byCategory: categoryStats,
    byDifficulty: difficultyStats,
  };
}
}

export default SeedService;