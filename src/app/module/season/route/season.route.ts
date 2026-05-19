
import { Router } from "express";

import { checkAuth } from "../../../middleware/checkAuth";
import { createSeason, getAllSeasons, getSeasonById } from "../controller/season.controller";

     
const router = Router();


router.get('/get-all', getAllSeasons);
router.get('/:id', getSeasonById);
router.post('/create', checkAuth("ADMIN", "SUPER_ADMIN"), createSeason);




export const SeasonRoutes = router;