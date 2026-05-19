import { prisma } from "../../../lib/prisma";

export class SeasonService {
  // Create season
  static async createSeason(payload: any) {
    const season = await prisma.season.create({
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
        challenges: payload.challenges || [],
        tips: payload.tips || [],
        festivals: payload.festivals || [],
        government_schemes: payload.government_schemes || []
      }
    });
    
    return season;
  }

  // Get all seasons
  static async getAllSeasons() {
    return await prisma.season.findMany({
      select: {
        id: true,
        seasonId: true,
        title: true,
        seasonCode: true,
        icon: true,
        color: true
      }
    });
  }

  // Get season by id
  static async getSeasonById(id: string) {
    return await prisma.season.findUnique({
      where: { id },
      include: {
        seeds: {
          take: 10,
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });
  }
}