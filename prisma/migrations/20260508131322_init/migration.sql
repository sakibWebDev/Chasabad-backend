-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'USER', 'EXPERT', 'RESEARCHER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('BLOCKED', 'DELETED', 'ACTIVE');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "SunlightRequirement" AS ENUM ('FULL_SUN', 'PARTIAL_SHADE', 'SHADE');

-- CreateEnum
CREATE TYPE "WaterRequirement" AS ENUM ('LOW', 'MODERATE', 'HIGH', 'FLOOD');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "SoilType" AS ENUM ('CLAY', 'SANDY', 'LOAMY', 'SILTY', 'PEATY', 'CHALKY', 'LATERITE', 'ALLUVIAL', 'BLACK_COTTON', 'RED');

-- CreateEnum
CREATE TYPE "IrrigationType" AS ENUM ('DRIP', 'SPRINKLER', 'FLOOD', 'FURROW', 'RAIN_FED', 'CANAL', 'TUBE_WELL');

-- CreateEnum
CREATE TYPE "FertilizerType" AS ENUM ('ORGANIC', 'INORGANIC', 'COMPOST', 'GREEN_MANURE', 'CHEMICAL', 'BIO_FERTILIZER');

-- CreateEnum
CREATE TYPE "DiseaseSeverity" AS ENUM ('MILD', 'MODERATE', 'SEVERE', 'DEADLY');

-- CreateEnum
CREATE TYPE "PestSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'EPIDEMIC');

-- CreateEnum
CREATE TYPE "CropGrowthStage" AS ENUM ('GERMINATION', 'SEEDLING', 'VEGETATIVE', 'FLOWERING', 'FRUITING', 'MATURATION', 'HARVESTING');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "needPasswordChange" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "image" TEXT,
    "phone" TEXT,
    "phoneVerified" TIMESTAMP(3),
    "address" TEXT,
    "city" TEXT,
    "district" TEXT,
    "division" TEXT,
    "postalCode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verifications" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seasons" (
    "id" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "description_en" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "seasonCode" TEXT NOT NULL,
    "bengali_months" TEXT[],
    "bangla_months_details" JSONB,
    "planting_months" TEXT[],
    "harvesting_period" TEXT NOT NULL,
    "soil_type" TEXT NOT NULL,
    "soil_type_enum" "SoilType",
    "water_requirements" TEXT NOT NULL,
    "irrigation_type" "IrrigationType",
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "temperature_min" DOUBLE PRECISION,
    "temperature_max" DOUBLE PRECISION,
    "humidity_range" TEXT,
    "rainfall_range" TEXT,
    "wind_speed_range" TEXT,
    "average_daylight" INTEGER,
    "suitable_crops_count" INTEGER DEFAULT 0,
    "challenges" TEXT[],
    "tips" TEXT[],
    "festivals" TEXT[],
    "government_schemes" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seeds" (
    "id" TEXT NOT NULL,
    "seedId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "scientific_name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "sub_category" TEXT,
    "season_id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "image_gallery" TEXT[],
    "video_url" TEXT,
    "icon" TEXT NOT NULL,
    "variety_type" TEXT,
    "origin_country" TEXT,
    "origin_region" TEXT,
    "year_of_introduction" INTEGER,
    "germination_time" TEXT NOT NULL,
    "germination_days" INTEGER,
    "maturity_time" TEXT NOT NULL,
    "maturity_days" INTEGER,
    "spacing" TEXT NOT NULL,
    "depth" TEXT NOT NULL,
    "depth_cm" DOUBLE PRECISION,
    "sunlight" "SunlightRequirement" NOT NULL,
    "watering" "WaterRequirement" NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "soil_type" TEXT NOT NULL,
    "soil_type_enum" "SoilType",
    "temperature" TEXT NOT NULL,
    "temperature_min" DOUBLE PRECISION,
    "temperature_max" DOUBLE PRECISION,
    "rainfall" TEXT NOT NULL,
    "rainfall_min_mm" INTEGER,
    "rainfall_max_mm" INTEGER,
    "ph_range" TEXT NOT NULL,
    "ph_min" DOUBLE PRECISION,
    "ph_max" DOUBLE PRECISION,
    "altitude_range" TEXT,
    "wind_tolerance" TEXT,
    "yield_per_hectare" TEXT NOT NULL,
    "yield_min_kg" INTEGER,
    "yield_max_kg" INTEGER,
    "harvest_method" TEXT NOT NULL,
    "storage" TEXT NOT NULL,
    "storage_days" INTEGER,
    "benefits" TEXT[],
    "benefits_bn" TEXT[],
    "precautions" TEXT[],
    "precautions_bn" TEXT[],
    "special_notes" TEXT NOT NULL,
    "special_notes_bn" TEXT,
    "nutritional_value" JSONB,
    "medicinal_uses" TEXT[],
    "commercial_uses" TEXT[],
    "export_potential" BOOLEAN DEFAULT false,
    "organic_certified" BOOLEAN DEFAULT false,
    "market_price" DOUBLE PRECISION,
    "seed_cost" DOUBLE PRECISION,
    "expected_profit" DOUBLE PRECISION,
    "carbon_footprint" DOUBLE PRECISION,
    "water_footprint" INTEGER,
    "sustainable_practices" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seeds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cultivation_methods" (
    "id" TEXT NOT NULL,
    "land_preparation" TEXT NOT NULL,
    "land_preparation_bn" TEXT,
    "sowing_time" TEXT NOT NULL,
    "sowing_time_bn" TEXT,
    "seed_quantity" TEXT NOT NULL,
    "seed_quantity_kg_per_hectare" DOUBLE PRECISION,
    "fertilizer_application" TEXT NOT NULL,
    "fertilizer_application_bn" TEXT,
    "irrigation" TEXT NOT NULL,
    "harvesting" TEXT NOT NULL,
    "harvesting_bn" TEXT,
    "nursery_preparation" TEXT,
    "transplanting" TEXT,
    "weeding" TEXT,
    "mulching" TEXT,
    "intercropping_suggestions" TEXT[],
    "crop_rotation" TEXT,
    "fertilizer_schedule" JSONB,
    "organic_fertilizers" TEXT[],
    "chemical_fertilizers" TEXT[],
    "irrigation_schedule" JSONB,
    "critical_watering_stages" TEXT[],
    "seed_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cultivation_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disease_management" (
    "id" TEXT NOT NULL,
    "blast" TEXT,
    "blast_bn" TEXT,
    "stem_rot" TEXT,
    "stem_rot_bn" TEXT,
    "leaf_blight" TEXT,
    "leaf_blight_bn" TEXT,
    "yellow_mosaic" TEXT,
    "yellow_mosaic_bn" TEXT,
    "powdery_mildew" TEXT,
    "powdery_mildew_bn" TEXT,
    "bacterial_blight" TEXT,
    "bacterial_blight_bn" TEXT,
    "other_diseases" JSONB,
    "disease_severity" "DiseaseSeverity",
    "symptoms" TEXT[],
    "prevention_methods" TEXT[],
    "organic_treatment" TEXT[],
    "chemical_treatment" TEXT[],
    "resistant_varieties" TEXT[],
    "biological_control" TEXT[],
    "cultural_control" TEXT[],
    "monitoring_frequency" TEXT,
    "early_warning_signs" TEXT[],
    "seed_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "disease_management_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pest_management" (
    "id" TEXT NOT NULL,
    "stem_borer" TEXT,
    "stem_borer_bn" TEXT,
    "aphids" TEXT,
    "aphids_bn" TEXT,
    "armyworm" TEXT,
    "armyworm_bn" TEXT,
    "thrips" TEXT,
    "thrips_bn" TEXT,
    "pod_borer" TEXT,
    "pod_borer_bn" TEXT,
    "other_pests" JSONB,
    "pest_severity" "PestSeverity",
    "symptoms" TEXT[],
    "prevention_methods" TEXT[],
    "organic_pesticides" TEXT[],
    "chemical_pesticides" TEXT[],
    "biological_control" TEXT[],
    "physical_control" TEXT[],
    "cultural_practices" TEXT[],
    "ipm_strategies" TEXT[],
    "peak_infestation_season" TEXT,
    "favorable_conditions" TEXT[],
    "seed_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pest_management_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION DEFAULT 0,
    "tax" DOUBLE PRECISION DEFAULT 0,
    "shipping_cost" DOUBLE PRECISION DEFAULT 0,
    "grand_total" DOUBLE PRECISION NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "payment_method" TEXT,
    "transaction_id" TEXT,
    "shipping_address" TEXT NOT NULL,
    "shipping_phone" TEXT NOT NULL,
    "delivery_date" TIMESTAMP(3),
    "tracking_number" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "seedId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "seedId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "comment" TEXT,
    "comment_bn" TEXT,
    "images" TEXT[],
    "verified_purchase" BOOLEAN NOT NULL DEFAULT false,
    "helpful_count" INTEGER NOT NULL DEFAULT 0,
    "reported" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_saved_seeds" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "seedId" TEXT NOT NULL,
    "notes" TEXT,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_saved_seeds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "queries" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "seedId" TEXT,
    "question" TEXT NOT NULL,
    "question_bn" TEXT,
    "answer" TEXT,
    "answer_bn" TEXT,
    "answeredBy" TEXT,
    "answeredAt" TIMESTAMP(3),
    "category" TEXT NOT NULL,
    "tags" TEXT[],
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "helpful_count" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "queries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expert_advice" (
    "id" TEXT NOT NULL,
    "expertId" TEXT NOT NULL,
    "userId" TEXT,
    "seedId" TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "content_bn" TEXT,
    "category" TEXT NOT NULL,
    "tags" TEXT[],
    "images" TEXT[],
    "video_url" TEXT,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expert_advice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "soil_tests" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "test_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "location" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "ph_level" DOUBLE PRECISION,
    "nitrogen_ppm" INTEGER,
    "phosphorus_ppm" INTEGER,
    "potassium_ppm" INTEGER,
    "organic_matter_percent" DOUBLE PRECISION,
    "soil_texture" TEXT,
    "soil_type" "SoilType",
    "salinity" DOUBLE PRECISION,
    "moisture_percent" DOUBLE PRECISION,
    "fertilizer_recommendation" TEXT,
    "crop_recommendation" TEXT[],
    "amendment_suggestions" TEXT[],
    "report_pdf" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "soil_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crop_plans" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "seedId" TEXT NOT NULL,
    "seasonId" TEXT,
    "land_area_hectares" DOUBLE PRECISION NOT NULL,
    "expected_planting_date" TIMESTAMP(3) NOT NULL,
    "expected_harvest_date" TIMESTAMP(3) NOT NULL,
    "seed_quantity_kg" DOUBLE PRECISION NOT NULL,
    "fertilizer_plan" JSONB,
    "irrigation_plan" JSONB,
    "pest_control_plan" JSONB,
    "estimated_cost" DOUBLE PRECISION NOT NULL,
    "estimated_revenue" DOUBLE PRECISION NOT NULL,
    "estimated_profit" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "actual_planting_date" TIMESTAMP(3),
    "actual_harvest_date" TIMESTAMP(3),
    "actual_yield_kg" DOUBLE PRECISION,
    "actual_profit" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crop_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weather_data" (
    "id" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "division" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "temperature_max" DOUBLE PRECISION NOT NULL,
    "temperature_min" DOUBLE PRECISION NOT NULL,
    "humidity" DOUBLE PRECISION NOT NULL,
    "rainfall_mm" DOUBLE PRECISION NOT NULL,
    "wind_speed" DOUBLE PRECISION NOT NULL,
    "pressure" DOUBLE PRECISION NOT NULL,
    "cloud_cover" DOUBLE PRECISION NOT NULL,
    "forecast_3day" JSONB,
    "forecast_7day" JSONB,
    "crop_advisory" TEXT,
    "alert_messages" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weather_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "title_bn" TEXT,
    "message" TEXT NOT NULL,
    "message_bn" TEXT,
    "type" TEXT NOT NULL,
    "link" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cultivation_guides" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "title_bn" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "content_bn" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "excerpt_bn" TEXT NOT NULL,
    "featured_image" TEXT NOT NULL,
    "gallery" TEXT[],
    "seedId" TEXT,
    "author" TEXT NOT NULL,
    "author_bio" TEXT,
    "category" TEXT NOT NULL,
    "tags" TEXT[],
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cultivation_guides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market_prices" (
    "id" TEXT NOT NULL,
    "seedId" TEXT NOT NULL,
    "market_name" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "wholesale_price" DOUBLE PRECISION NOT NULL,
    "retail_price" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trend" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "market_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "government_subsidies" (
    "id" TEXT NOT NULL,
    "scheme_name" TEXT NOT NULL,
    "scheme_name_bn" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "description_bn" TEXT NOT NULL,
    "applicable_crops" TEXT[],
    "eligible_farmers" TEXT[],
    "subsidy_percent" DOUBLE PRECISION NOT NULL,
    "max_amount" DOUBLE PRECISION NOT NULL,
    "application_start" TIMESTAMP(3) NOT NULL,
    "application_end" TIMESTAMP(3) NOT NULL,
    "website" TEXT,
    "contact_number" TEXT,
    "documents_required" TEXT[],
    "application_process" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "government_subsidies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farmer_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_bn" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "description_bn" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "division" TEXT NOT NULL,
    "member_count" INTEGER NOT NULL DEFAULT 0,
    "total_land_hectares" DOUBLE PRECISION NOT NULL,
    "leader_id" TEXT NOT NULL,
    "crops_cultivated" TEXT[],
    "achievements" TEXT[],
    "contact_email" TEXT,
    "contact_phone" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "farmer_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sensor_data" (
    "id" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "soil_moisture" DOUBLE PRECISION,
    "soil_temperature" DOUBLE PRECISION,
    "soil_ec" DOUBLE PRECISION,
    "soil_nitrogen" INTEGER,
    "soil_phosphorus" INTEGER,
    "soil_potassium" INTEGER,
    "air_temperature" DOUBLE PRECISION,
    "air_humidity" DOUBLE PRECISION,
    "light_intensity" DOUBLE PRECISION,
    "co2_level" DOUBLE PRECISION,
    "crop_health_index" DOUBLE PRECISION,
    "leaf_wetness" DOUBLE PRECISION,
    "growth_stage" "CropGrowthStage",
    "location_lat" DOUBLE PRECISION,
    "location_lng" DOUBLE PRECISION,

    CONSTRAINT "sensor_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventories" (
    "id" TEXT NOT NULL,
    "seedId" TEXT NOT NULL,
    "quantity_kg" DOUBLE PRECISION NOT NULL,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "location" TEXT NOT NULL,
    "batch_number" TEXT,
    "expiry_date" TIMESTAMP(3),
    "last_restocked" TIMESTAMP(3),
    "next_restock_date" TIMESTAMP(3),
    "min_stock_level" DOUBLE PRECISION,
    "max_stock_level" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'in_stock',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GroupMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GroupMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE INDEX "accounts_userId_idx" ON "accounts"("userId");

-- CreateIndex
CREATE INDEX "verifications_identifier_idx" ON "verifications"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "seasons_seasonId_key" ON "seasons"("seasonId");

-- CreateIndex
CREATE UNIQUE INDEX "seasons_seasonCode_key" ON "seasons"("seasonCode");

-- CreateIndex
CREATE INDEX "seasons_seasonId_idx" ON "seasons"("seasonId");

-- CreateIndex
CREATE INDEX "seasons_season_idx" ON "seasons"("season");

-- CreateIndex
CREATE INDEX "seasons_seasonCode_idx" ON "seasons"("seasonCode");

-- CreateIndex
CREATE UNIQUE INDEX "seeds_seedId_key" ON "seeds"("seedId");

-- CreateIndex
CREATE INDEX "seeds_seedId_idx" ON "seeds"("seedId");

-- CreateIndex
CREATE INDEX "seeds_name_idx" ON "seeds"("name");

-- CreateIndex
CREATE INDEX "seeds_name_en_idx" ON "seeds"("name_en");

-- CreateIndex
CREATE INDEX "seeds_category_idx" ON "seeds"("category");

-- CreateIndex
CREATE INDEX "seeds_sub_category_idx" ON "seeds"("sub_category");

-- CreateIndex
CREATE INDEX "seeds_season_id_idx" ON "seeds"("season_id");

-- CreateIndex
CREATE INDEX "seeds_difficulty_idx" ON "seeds"("difficulty");

-- CreateIndex
CREATE INDEX "seeds_organic_certified_idx" ON "seeds"("organic_certified");

-- CreateIndex
CREATE UNIQUE INDEX "cultivation_methods_seed_id_key" ON "cultivation_methods"("seed_id");

-- CreateIndex
CREATE UNIQUE INDEX "disease_management_seed_id_key" ON "disease_management"("seed_id");

-- CreateIndex
CREATE UNIQUE INDEX "pest_management_seed_id_key" ON "pest_management"("seed_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderId_key" ON "orders"("orderId");

-- CreateIndex
CREATE INDEX "orders_orderId_idx" ON "orders"("orderId");

-- CreateIndex
CREATE INDEX "orders_userId_idx" ON "orders"("userId");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_createdAt_idx" ON "orders"("createdAt");

-- CreateIndex
CREATE INDEX "reviews_seedId_idx" ON "reviews"("seedId");

-- CreateIndex
CREATE INDEX "reviews_rating_idx" ON "reviews"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_userId_seedId_key" ON "reviews"("userId", "seedId");

-- CreateIndex
CREATE UNIQUE INDEX "user_saved_seeds_userId_seedId_key" ON "user_saved_seeds"("userId", "seedId");

-- CreateIndex
CREATE INDEX "queries_userId_idx" ON "queries"("userId");

-- CreateIndex
CREATE INDEX "queries_seedId_idx" ON "queries"("seedId");

-- CreateIndex
CREATE INDEX "queries_status_idx" ON "queries"("status");

-- CreateIndex
CREATE INDEX "expert_advice_expertId_idx" ON "expert_advice"("expertId");

-- CreateIndex
CREATE INDEX "expert_advice_userId_idx" ON "expert_advice"("userId");

-- CreateIndex
CREATE INDEX "expert_advice_seedId_idx" ON "expert_advice"("seedId");

-- CreateIndex
CREATE INDEX "expert_advice_category_idx" ON "expert_advice"("category");

-- CreateIndex
CREATE INDEX "expert_advice_is_featured_idx" ON "expert_advice"("is_featured");

-- CreateIndex
CREATE INDEX "soil_tests_userId_idx" ON "soil_tests"("userId");

-- CreateIndex
CREATE INDEX "soil_tests_test_date_idx" ON "soil_tests"("test_date");

-- CreateIndex
CREATE INDEX "crop_plans_userId_idx" ON "crop_plans"("userId");

-- CreateIndex
CREATE INDEX "crop_plans_seedId_idx" ON "crop_plans"("seedId");

-- CreateIndex
CREATE INDEX "crop_plans_status_idx" ON "crop_plans"("status");

-- CreateIndex
CREATE INDEX "weather_data_date_idx" ON "weather_data"("date");

-- CreateIndex
CREATE INDEX "weather_data_district_idx" ON "weather_data"("district");

-- CreateIndex
CREATE UNIQUE INDEX "weather_data_location_date_key" ON "weather_data"("location", "date");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_isRead_idx" ON "notifications"("isRead");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "cultivation_guides_slug_key" ON "cultivation_guides"("slug");

-- CreateIndex
CREATE INDEX "cultivation_guides_slug_idx" ON "cultivation_guides"("slug");

-- CreateIndex
CREATE INDEX "cultivation_guides_category_idx" ON "cultivation_guides"("category");

-- CreateIndex
CREATE INDEX "cultivation_guides_is_published_idx" ON "cultivation_guides"("is_published");

-- CreateIndex
CREATE INDEX "market_prices_seedId_idx" ON "market_prices"("seedId");

-- CreateIndex
CREATE INDEX "market_prices_district_idx" ON "market_prices"("district");

-- CreateIndex
CREATE INDEX "market_prices_date_idx" ON "market_prices"("date");

-- CreateIndex
CREATE INDEX "government_subsidies_is_active_idx" ON "government_subsidies"("is_active");

-- CreateIndex
CREATE INDEX "government_subsidies_application_start_application_end_idx" ON "government_subsidies"("application_start", "application_end");

-- CreateIndex
CREATE INDEX "farmer_groups_district_idx" ON "farmer_groups"("district");

-- CreateIndex
CREATE INDEX "sensor_data_device_id_idx" ON "sensor_data"("device_id");

-- CreateIndex
CREATE INDEX "sensor_data_timestamp_idx" ON "sensor_data"("timestamp");

-- CreateIndex
CREATE INDEX "sensor_data_userId_idx" ON "sensor_data"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "inventories_seedId_key" ON "inventories"("seedId");

-- CreateIndex
CREATE INDEX "inventories_seedId_idx" ON "inventories"("seedId");

-- CreateIndex
CREATE INDEX "inventories_status_idx" ON "inventories"("status");

-- CreateIndex
CREATE INDEX "_GroupMembers_B_index" ON "_GroupMembers"("B");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seeds" ADD CONSTRAINT "seeds_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "seasons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cultivation_methods" ADD CONSTRAINT "cultivation_methods_seed_id_fkey" FOREIGN KEY ("seed_id") REFERENCES "seeds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disease_management" ADD CONSTRAINT "disease_management_seed_id_fkey" FOREIGN KEY ("seed_id") REFERENCES "seeds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pest_management" ADD CONSTRAINT "pest_management_seed_id_fkey" FOREIGN KEY ("seed_id") REFERENCES "seeds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_seedId_fkey" FOREIGN KEY ("seedId") REFERENCES "seeds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_seedId_fkey" FOREIGN KEY ("seedId") REFERENCES "seeds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_saved_seeds" ADD CONSTRAINT "user_saved_seeds_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_saved_seeds" ADD CONSTRAINT "user_saved_seeds_seedId_fkey" FOREIGN KEY ("seedId") REFERENCES "seeds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "queries" ADD CONSTRAINT "queries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "queries" ADD CONSTRAINT "queries_seedId_fkey" FOREIGN KEY ("seedId") REFERENCES "seeds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_advice" ADD CONSTRAINT "expert_advice_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_advice" ADD CONSTRAINT "expert_advice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_advice" ADD CONSTRAINT "expert_advice_seedId_fkey" FOREIGN KEY ("seedId") REFERENCES "seeds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "soil_tests" ADD CONSTRAINT "soil_tests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crop_plans" ADD CONSTRAINT "crop_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crop_plans" ADD CONSTRAINT "crop_plans_seedId_fkey" FOREIGN KEY ("seedId") REFERENCES "seeds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crop_plans" ADD CONSTRAINT "crop_plans_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "seasons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cultivation_guides" ADD CONSTRAINT "cultivation_guides_seedId_fkey" FOREIGN KEY ("seedId") REFERENCES "seeds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "market_prices" ADD CONSTRAINT "market_prices_seedId_fkey" FOREIGN KEY ("seedId") REFERENCES "seeds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmer_groups" ADD CONSTRAINT "farmer_groups_leader_id_fkey" FOREIGN KEY ("leader_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sensor_data" ADD CONSTRAINT "sensor_data_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_seedId_fkey" FOREIGN KEY ("seedId") REFERENCES "seeds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupMembers" ADD CONSTRAINT "_GroupMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "farmer_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupMembers" ADD CONSTRAINT "_GroupMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
