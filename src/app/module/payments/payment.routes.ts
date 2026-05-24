// routes/payment.routes.ts
import { Router } from 'express';
import { checkAuth } from '../../middleware/checkAuth';
import {
  initPayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN,
  refundPayment
} from './payment.controller';

const router = Router();

// Public routes (SSLCommerz callbacks)
router.post('/init', checkAuth(), initPayment);
router.get('/success', paymentSuccess);
router.get('/fail', paymentFail);
router.get('/cancel', paymentCancel);
router.post('/ipn', paymentIPN);

// Admin routes
router.post('/refund', checkAuth('ADMIN', 'SUPER_ADMIN'), refundPayment);

export const PaymentRoutes = router;