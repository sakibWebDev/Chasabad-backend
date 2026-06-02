import { Router } from "express";
import { checkAuth } from "../../../middleware/checkAuth";
import { 
  createSeason, 
  getAllSeasons, 
  getSeasonById,
  updateSeason,
  deleteSeason,
  getSeasonsBySoilType,
  getSeasonsPaginated
} from "../controller/season.controller";

const router = Router();

// Public routes (no authentication required)
router.get('/get-all', getAllSeasons);
router.get('/paginated', getSeasonsPaginated);
router.get('/soil-type/:soilType', getSeasonsBySoilType);
router.get('/:id', getSeasonById);

// Protected routes (Admin only)
router.post('/create', checkAuth("ADMIN", "SUPER_ADMIN"), createSeason);
router.put('/update/:id', checkAuth("ADMIN", "SUPER_ADMIN"), updateSeason);
router.patch('/update/:id', checkAuth("ADMIN", "SUPER_ADMIN"), updateSeason); 
router.delete('/delete/:id', checkAuth("ADMIN", "SUPER_ADMIN"), deleteSeason);

// Optional: Bulk operations (Admin only)
router.post('/bulk-create', checkAuth("ADMIN", "SUPER_ADMIN"), createSeason);
router.delete('/bulk-delete', checkAuth("ADMIN", "SUPER_ADMIN"), deleteSeason);

export const SeasonRoutes = router;