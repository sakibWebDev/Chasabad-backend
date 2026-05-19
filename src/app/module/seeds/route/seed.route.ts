import { Router } from "express";
import { checkAuth } from "../../../middleware/checkAuth";

import {
  createSeed,
  getAllSeeds,
  getSeedById,
  updateSeed,
  deleteSeed,
  getSeedsByCategory,
  getFeaturedSeeds,
  searchSeeds,
  getSeedsByDifficulty,
  getSeedsBySeason,
  getStatistics
} from '../controller/seeds.controller';


const router = Router();

router.get('/get-all', getAllSeeds);
router.get('/featured', getFeaturedSeeds);
router.get('/search', searchSeeds);
router.get('/statistics', getStatistics);
router.get('/category/:category', getSeedsByCategory);
router.get('/difficulty/:difficulty', getSeedsByDifficulty);
router.get('/season/:seasonId', getSeedsBySeason);
router.get('/:id', getSeedById);

// Protected routes (Admin only)
router.post('/create',  checkAuth("SUPER_ADMIN","USER" , "ADMIN"), createSeed);
router.put('/:id',  checkAuth("SUPER_ADMIN","USER" , "ADMIN"), updateSeed);
router.delete('/:id',  checkAuth("SUPER_ADMIN","USER" , "ADMIN"), deleteSeed);

 export const SeedRoutes = router;
