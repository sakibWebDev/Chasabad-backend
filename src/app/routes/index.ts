import { AdminRoutes } from "../module/admin/route/admin.route";
import { AuthRoutes } from "../module/auth/auth.route";
import {UserRoutese} from "../module/services/user.route";
import { Router } from "express";
import { SeedRoutes } from "../module/seeds/route/seed.route";
import { SeasonRoutes } from "../module/season/route/season.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/user", UserRoutese);
router.use("/admin", AdminRoutes);
router.use("/seeds", SeedRoutes);
router.use("/season", SeasonRoutes);

export const IndexRoutes = router;