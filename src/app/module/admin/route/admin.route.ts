import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { checkAuth } from "../../../middleware/checkAuth";

const router = Router();

/* =========================
   Dashboard
========================= */
router.get(
  "/all-users",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  AdminController.getUsers
);

// /* =========================
//    Users
// ========================= */
// router.get(
//   "/users",
//   checkAuth("ADMIN", "SUPER_ADMIN"),
//   AdminController.getUsers
// );

router.get(
  "/users/:id",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  AdminController.getUserById
);

router.post(
  "/users",
  checkAuth("SUPER_ADMIN"),
  AdminController.createUser
);

router.post(
  "/users/:id/edit",
  checkAuth("SUPER_ADMIN","USER" , "ADMIN"),
  AdminController.updatedUser
);

router.patch(
  "/users/:id",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  AdminController.updateUser
);

router.delete(
  "/users/:id",
  checkAuth("SUPER_ADMIN"),
  AdminController.deleteUser
);

router.patch(
  "/users/:id/status",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  AdminController.updateUserStatus
);

/* =========================
//    Seeds
// ========================= */
// router.get(
//   "/seeds",
  
//   AdminController.getSeeds
// );

// router.post(
//   "/seeds",
//   checkAuth("ADMIN", "SUPER_ADMIN"),
//   AdminController.createSeed
// );

// router.patch(
//   "/seeds/:id",
//   checkAuth("ADMIN", "SUPER_ADMIN"),
//   AdminController.updateSeed
// );

// router.delete(
//   "/seeds/:id",
//   checkAuth("SUPER_ADMIN"),
//   AdminController.deleteSeed
// );

/* =========================
   Orders
========================= */
// router.get(
//   "/orders",
//   checkAuth("ADMIN", "SUPER_ADMIN"),
//   AdminController.getOrders
// );

// router.get(
//   "/orders/:id",
//   checkAuth("ADMIN", "SUPER_ADMIN"),
//   AdminController.getOrderById
// );

// router.patch(
//   "/orders/:id/status",
//   checkAuth("ADMIN", "SUPER_ADMIN"),
//   AdminController.updateOrderStatus
// );

// router.patch(
//   "/orders/:id/cancel",
//   checkAuth("ADMIN", "SUPER_ADMIN"),
//   AdminController.cancelOrder
// );

export const AdminRoutes = router;
