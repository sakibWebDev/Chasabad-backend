import { Router } from "express";

import { checkAuth } from "../../middleware/checkAuth";
import { UserRoutes } from "./user.controller";

//checkAuth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN), UserRoutes.getMe
     
const router = Router();

router.get("/me", checkAuth(), UserRoutes.getMe)




export const UserRoutese = router;