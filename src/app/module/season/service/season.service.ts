import { prisma } from "../../../lib/prisma";
import { Prisma } from '@prisma/client';

// Define types for better type safety
interface CreateSeasonPayload {
  seasonId: string;
  title: string;
  title_en?: string;
  description?: string;
  description_en?: string;
  season?: string;
  seasonCode?: string;
  bengali_months?: any;
  bangla_months_details?: any;
  planting_months?: any;
  harvesting_period?: string;
  soil_type?: string;
  soil_type_enum?: string;
  water_requirements?: string;
  irrigation_type?: string;
  icon?: string;
  color?: string;
  temperature_min?: number;
  temperature_max?: number;
  humidity_range?: string;
  rainfall_range?: string;
  wind_speed_range?: string;
  average_daylight?: string;
  suitable_crops_count?: number;
  challenges?: any;
  tips?: any;
  festivals?: any;
  government_schemes?: any;
}

export class SeasonService {
  // Create season
  static async createSeason(payload: CreateSeasonPayload) {
    try {
      // Validation
      if (!payload.seasonId || !payload.title) {
        throw new Error('Season ID and Title are required');
      }
      
      const season = await prisma.season.create({
        data: {
          seasonId: payload.seasonId,
          title: payload.title,
          title_en: payload.title_en || null,
          description: payload.description || null,
          description_en: payload.description_en || null,
          season: payload.season || null,
          seasonCode: payload.seasonCode || null,
          bengali_months: payload.bengali_months || null,
          bangla_months_details: payload.bangla_months_details || null,
          planting_months: payload.planting_months || null,
          harvesting_period: payload.harvesting_period || null,
          soil_type: payload.soil_type || null,
          soil_type_enum: payload.soil_type_enum || null,
          water_requirements: payload.water_requirements || null,
          irrigation_type: payload.irrigation_type || null,
          icon: payload.icon || null,
          color: payload.color || null,
          temperature_min: payload.temperature_min || null,
          temperature_max: payload.temperature_max || null,
          humidity_range: payload.humidity_range || null,
          rainfall_range: payload.rainfall_range || null,
          wind_speed_range: payload.wind_speed_range || null,
          average_daylight: payload.average_daylight || null,
          suitable_crops_count: payload.suitable_crops_count || 0,
          challenges: payload.challenges || [],
          tips: payload.tips || [],
          festivals: payload.festivals || [],
          government_schemes: payload.government_schemes || []
        }
      });
      
      return season;
    } catch (error: any) {
      console.error('Error creating season:', error);
      throw new Error(`Failed to create season: ${error.message}`);
    }
  }

  // Get all seasons
  static async getAllSeasons() {
    try {
      const seasons = await prisma.season.findMany({
        select: {
          id: true,
          seasonId: true,
          title: true,
          title_en: true,
          seasonCode: true,
          icon: true,
          color: true,
          season: true,
          suitable_crops_count: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return seasons;
    } catch (error: any) {
      console.error('Error fetching seasons:', error);
      throw new Error(`Failed to fetch seasons: ${error.message}`);
    }
  }

  // Get season by id
  static async getSeasonById(id: string) {
    try {
      // Validation
      if (!id) {
        throw new Error('Season ID is required');
      }
      
      const season = await prisma.season.findUnique({
        where: { id },
        include: {
          seeds: {
            take: 10,
            select: {
              id: true,
              name: true,
              name_en: true,
              image: true,
              price: true
            }
          }
        }
      });
      
      if (!season) {
        throw new Error(`Season with ID ${id} not found`);
      }
      
      return season;
    } catch (error: any) {
      console.error('Error fetching season by ID:', error);
      throw error;
    }
  }

  // Get season by seasonId
  static async getSeasonBySeasonId(seasonId: string) {
    try {
      if (!seasonId) {
        throw new Error('Season ID is required');
      }
      
      const season = await prisma.season.findUnique({
        where: { seasonId },
        include: {
          seeds: {
            select: {
              id: true,
              name: true,
              name_en: true,
              image: true,
              price: true
            }
          }
        }
      });
      
      if (!season) {
        throw new Error(`Season with seasonId ${seasonId} not found`);
      }
      
      return season;
    } catch (error: any) {
      console.error('Error fetching season by seasonId:', error);
      throw error;
    }
  }

  // Update season
  static async updateSeason(id: string, payload: Partial<CreateSeasonPayload>) {
    try {
      if (!id) {
        throw new Error('Season ID is required');
      }
      
      // Check if season exists
      const existingSeason = await prisma.season.findUnique({
        where: { id }
      });
      
      if (!existingSeason) {
        throw new Error(`Season with ID ${id} not found`);
      }
      
      const updatedSeason = await prisma.season.update({
        where: { id },
        data: {
          seasonId: payload.seasonId,
          title: payload.title,
          title_en: payload.title_en,
          description: payload.description,
          description_en: payload.description_en,
          season: payload.season,
          seasonCode: payload.seasonCode,
          bengali_months: payload.bengali_months,
          bangla_months_details: payload.bangla_months_details,
          planting_months: payload.planting_months,
          harvesting_period: payload.harvesting_period,
          soil_type: payload.soil_type,
          soil_type_enum: payload.soil_type_enum,
          water_requirements: payload.water_requirements,
          irrigation_type: payload.irrigation_type,
          icon: payload.icon,
          color: payload.color,
          temperature_min: payload.temperature_min,
          temperature_max: payload.temperature_max,
          humidity_range: payload.humidity_range,
          rainfall_range: payload.rainfall_range,
          wind_speed_range: payload.wind_speed_range,
          average_daylight: payload.average_daylight,
          suitable_crops_count: payload.suitable_crops_count,
          challenges: payload.challenges,
          tips: payload.tips,
          festivals: payload.festivals,
          government_schemes: payload.government_schemes
        }
      });
      
      return updatedSeason;
    } catch (error: any) {
      console.error('Error updating season:', error);
      throw new Error(`Failed to update season: ${error.message}`);
    }
  }

  // Delete season
  static async deleteSeason(id: string) {
    try {
      if (!id) {
        throw new Error('Season ID is required');
      }
      
      // Check if season exists
      const existingSeason = await prisma.season.findUnique({
        where: { id }
      });
      
      if (!existingSeason) {
        throw new Error(`Season with ID ${id} not found`);
      }
      
      const deletedSeason = await prisma.season.delete({
        where: { id }
      });
      
      return deletedSeason;
    } catch (error: any) {
      console.error('Error deleting season:', error);
      throw new Error(`Failed to delete season: ${error.message}`);
    }
  }

  // Get seasons with pagination
  static async getSeasonsPaginated(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const [seasons, total] = await Promise.all([
        prisma.season.findMany({
          skip,
          take: limit,
          select: {
            id: true,
            seasonId: true,
            title: true,
            title_en: true,
            icon: true,
            color: true,
            suitable_crops_count: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }),
        prisma.season.count()
      ]);
      
      return {
        data: seasons,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error: any) {
      console.error('Error fetching paginated seasons:', error);
      throw new Error(`Failed to fetch seasons: ${error.message}`);
    }
  }

  // Get seasons by soil type
  static async getSeasonsBySoilType(soilType: string) {
    try {
      if (!soilType) {
        throw new Error('Soil type is required');
      }
      
      const seasons = await prisma.season.findMany({
        where: {
          soil_type_enum: soilType
        },
        select: {
          id: true,
          seasonId: true,
          title: true,
          title_en: true,
          icon: true,
          color: true,
          soil_type: true,
          soil_type_enum: true
        }
      });
      
      return seasons;
    } catch (error: any) {
      console.error('Error fetching seasons by soil type:', error);
      throw new Error(`Failed to fetch seasons: ${error.message}`);
    }
  }
}