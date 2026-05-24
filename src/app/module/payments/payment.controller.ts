// controllers/payment.controller.ts
import { Request, Response } from 'express';
import { sslcz } from '../config/sslcommerz.config';
import { prisma } from '../lib/prisma';
import { envVars } from '../config/env';

interface PaymentInitData {
  total_amount: number;
  tran_id: string;
  cus_name: string;
  cus_email: string;
  cus_phone: string;
  cus_add1: string;
  cus_city: string;
  cus_country: string;
  product_name: string;
  product_category: string;
  orderId: string;
}

// Initialize Payment
export const initPayment = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    
    // Get order details from database
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true, items: true }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const tran_id = `TRAN_${Date.now()}_${order.orderId}`;

    // Prepare payment data
    const paymentData = {
      total_amount: order.grand_total,
      currency: 'BDT',
      tran_id: tran_id,
      success_url: envVars.SSL_COMMERZ_SUCCESS_URL,
      fail_url: envVars.SSL_COMMERZ_FAIL_URL,
      cancel_url: envVars.SSL_COMMERZ_CANCEL_URL,
      ipn_url: envVars.SSL_COMMERZ_IPN_URL,
      shipping_method: 'Courier',
      product_name: order.items.map(item => item.name).join(', '),
      product_category: 'Seeds',
      product_profile: 'general',
      cus_name: order.user?.name || req.body.cus_name,
      cus_email: order.user?.email || req.body.cus_email,
      cus_add1: order.shipping_address,
      cus_add2: '',
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: order.shipping_phone,
      cus_fax: order.shipping_phone,
      ship_name: order.user?.name || req.body.cus_name,
      ship_add1: order.shipping_address,
      ship_add2: '',
      ship_city: 'Dhaka',
      ship_state: 'Dhaka',
      ship_postcode: 1000,
      ship_country: 'Bangladesh',
      value_a: order.id,
      value_b: order.orderId,
      value_c: tran_id,
      value_d: order.user?.id || ''
    };

    // Initiate payment with SSLCommerz
    const sslResponse = await sslcz.init(paymentData);

    if (sslResponse.status === 'SUCCESS') {
      // Update order with transaction ID
      await prisma.order.update({
        where: { id: order.id },
        data: {
          transaction_id: tran_id,
          payment_status: 'PENDING'
        }
      });

      return res.status(200).json({
        success: true,
        gatewayUrl: sslResponse.GatewayPageURL,
        transactionId: tran_id
      });
    } else {
      return res.status(400).json({
        success: false,
        message: sslResponse.failedreason || 'Payment initiation failed'
      });
    }
  } catch (error: any) {
    console.error('Payment initiation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Payment initiation failed',
      error: error.message
    });
  }
};

// Payment Success Callback
export const paymentSuccess = async (req: Request, res: Response) => {
  try {
    const { tran_id, val_id, status } = req.query;

    if (!tran_id || !val_id) {
      return res.redirect(`${envVars.FRONTEND_URL}/payment/failed?message=Invalid payment response`);
    }

    // Validate payment with SSLCommerz
    const validation = await sslcz.validate({ val_id: val_id as string });

    if (validation.status === 'VALID') {
      // Find order by transaction ID
      const order = await prisma.order.findFirst({
        where: { transaction_id: tran_id as string }
      });

      if (order) {
        // Update order payment status
        await prisma.order.update({
          where: { id: order.id },
          data: {
            payment_status: 'COMPLETED',
            status: 'PROCESSING'
          }
        });

        // Redirect to success page
        return res.redirect(`${envVars.FRONTEND_URL}/order-confirmation?orderId=${order.orderId}&payment=success`);
      }
    }

    return res.redirect(`${envVars.FRONTEND_URL}/payment/failed?message=Payment validation failed`);
  } catch (error) {
    console.error('Payment success error:', error);
    return res.redirect(`${envVars.FRONTEND_URL}/payment/failed?message=Payment processing error`);
  }
};

// Payment Fail Callback
export const paymentFail = async (req: Request, res: Response) => {
  try {
    const { tran_id } = req.query;

    if (tran_id) {
      const order = await prisma.order.findFirst({
        where: { transaction_id: tran_id as string }
      });

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            payment_status: 'FAILED'
          }
        });
      }
    }

    return res.redirect(`${envVars.FRONTEND_URL}/payment/failed?message=Payment failed`);
  } catch (error) {
    console.error('Payment fail error:', error);
    return res.redirect(`${envVars.FRONTEND_URL}/payment/failed?message=Payment processing error`);
  }
};

// Payment Cancel Callback
export const paymentCancel = async (req: Request, res: Response) => {
  try {
    const { tran_id } = req.query;

    if (tran_id) {
      const order = await prisma.order.findFirst({
        where: { transaction_id: tran_id as string }
      });

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            payment_status: 'CANCELLED'
          }
        });
      }
    }

    return res.redirect(`${envVars.FRONTEND_URL}/payment/cancelled`);
  } catch (error) {
    console.error('Payment cancel error:', error);
    return res.redirect(`${envVars.FRONTEND_URL}/payment/cancelled`);
  }
};

// IPN (Instant Payment Notification) Callback
export const paymentIPN = async (req: Request, res: Response) => {
  try {
    const { tran_id, val_id, status } = req.body;

    if (status === 'VALID') {
      const validation = await sslcz.validate({ val_id });

      if (validation.status === 'VALID') {
        const order = await prisma.order.findFirst({
          where: { transaction_id: tran_id }
        });

        if (order && order.payment_status !== 'COMPLETED') {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              payment_status: 'COMPLETED',
              status: 'PROCESSING'
            }
          });

          // Send email/SMS notification
          console.log(`Payment confirmed for order: ${order.orderId}`);
        }
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('IPN error:', error);
    res.status(500).send('Error');
  }
};

// Refund Payment (Admin only)
export const refundPayment = async (req: Request, res: Response) => {
  try {
    const { orderId, refund_amount, refund_remarks } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order || !order.transaction_id) {
      return res.status(404).json({
        success: false,
        message: 'Order or transaction not found'
      });
    }

    const refundData = {
      refund_amount: refund_amount,
      refund_remarks: refund_remarks,
      bank_tran_id: order.transaction_id,
      refe_id: `REF_${Date.now()}`
    };

    const refundResponse = await sslcz.initiateRefund(refundData);

    if (refundResponse.status === 'success') {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          payment_status: 'REFUNDED',
          status: 'REFUNDED'
        }
      });

      return res.status(200).json({
        success: true,
        message: 'Refund initiated successfully',
        data: refundResponse
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Refund failed',
        data: refundResponse
      });
    }
  } catch (error: any) {
    console.error('Refund error:', error);
    return res.status(500).json({
      success: false,
      message: 'Refund failed',
      error: error.message
    });
  }
};