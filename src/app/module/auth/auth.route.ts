import { Router } from "express";
import { AuthController } from "./auth.controller";

     
const router = Router();
//checkAuth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN), 

router.post("/login", AuthController.loginUser);
router.post("/refresh-token", AuthController.getNewToken);
router.post("/change-password", AuthController.changePassword)
router.post("/logout", AuthController.logoutUser)
router.post("/verify-email", AuthController.verifyEmail);
router.post("/forget-password", AuthController.forgetPassword);
router.post("/reset-password", AuthController.resetPassword);
router.post("/resend-otp", AuthController.resendOTP);



export const AuthRoutes = router;