// routes/order.routes.ts

import { Router } from 'express';
import { 
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  getOrderByOrderId,
  updateOrderStatus,
  updatePaymentStatus,
  updateTrackingNumber,
  cancelOrder,
  deleteOrder,
  getOrderStats,
  searchOrders,
  getMonthlyRevenue
} from '../controllers/order.controller';
import { checkAuth } from '../../../middleware/checkAuth';

const router = Router();

// ============ Public Routes ============
router.post('/create', checkAuth(), createOrder);
router.get('/track/:orderId', getOrderByOrderId);

// ============ User Routes (Authenticated) ============
router.get('/my-orders', checkAuth(), getUserOrders);
router.get('/:id', checkAuth(), getOrderById);
router.post('/:id/cancel', checkAuth(), cancelOrder);

// ============ Admin Routes ============
router.get('/admin/all', checkAuth('ADMIN', 'SUPER_ADMIN'), getAllOrders);
router.get('/admin/stats', checkAuth('ADMIN', 'SUPER_ADMIN'), getOrderStats);
router.get('/admin/search', checkAuth('ADMIN', 'SUPER_ADMIN'), searchOrders);
router.get('/admin/revenue/monthly', checkAuth('ADMIN', 'SUPER_ADMIN'), getMonthlyRevenue);
router.put('/admin/:id/status', checkAuth('ADMIN', 'SUPER_ADMIN'), updateOrderStatus);
router.put('/admin/:id/payment', checkAuth('ADMIN', 'SUPER_ADMIN'), updatePaymentStatus);
router.put('/admin/:id/tracking', checkAuth('ADMIN', 'SUPER_ADMIN'), updateTrackingNumber);
router.delete('/admin/:id', checkAuth('ADMIN', 'SUPER_ADMIN'), deleteOrder);

export const OrderRoutes = router;