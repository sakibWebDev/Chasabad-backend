// controllers/order.controller.ts

import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { OrderStatus, PaymentStatus } from '../../../../generated/prisma/enums';

// Create new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const email = req.user?.email;
    console.log('Create order request from user:', userId, 'with email:', email);
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    const {
      items,
      total_amount,
      discount,
      tax,
      shipping_cost,
      grand_total,
      payment_method,
      shipping_address,
      shipping_phone,
      notes
    } = req.body;
    
    // Validation
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'অর্ডার করতে কমপক্ষে একটি পণ্য নির্বাচন করুন'
      });
    }
    
    if (!shipping_address || !shipping_phone) {
      return res.status(400).json({
        success: false,
        message: 'ডেলিভারি ঠিকানা এবং ফোন নম্বর প্রয়োজন'
      });
    }
    
    const order = await OrderService.createOrder(userId, email, {
      userId,
      items,
      total_amount,
      discount,
      tax,
      shipping_cost,
      grand_total,
      payment_method,
      shipping_address,
      shipping_phone,
      notes
    });
    
    res.status(201).json({
      success: true,
      message: 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!',
      data: order
    });
    
  } catch (error: any) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'অর্ডার করতে সমস্যা হয়েছে',
      error: error.message
    });
  }
};

// Get all orders (Admin only)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    
    const result = await OrderService.getAllOrders(page, limit, status);
    
    res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully',
      data: result
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders',
      error: error.message
    });
  }
};

// Get user orders (Authenticated user)
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    const orders = await OrderService.getUserOrders(userId);
    
    res.status(200).json({
      success: true,
      message: 'User orders retrieved successfully',
      data: orders
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user orders',
      error: error.message
    });
  }
};

// Get order by ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await OrderService.getOrderById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check authorization (order owner or admin)
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    
    if (order.userId !== userId && userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this order'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Order retrieved successfully',
      data: order
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order',
      error: error.message
    });
  }
};

// Get order by orderId (Public tracking)
export const getOrderByOrderId = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params as { orderId: string };
    const order = await OrderService.getOrderByOrderId(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Order retrieved successfully',
      data: {
        orderId: order.orderId,
        status: order.status,
        payment_status: order.payment_status,
        grand_total: order.grand_total,
        createdAt: order.createdAt,
        delivery_date: order.delivery_date,
        tracking_number: order.tracking_number,
        items: order.items
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order',
      error: error.message
    });
  }
};

// Update order status (Admin only)
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !Object.values(OrderStatus).includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required. Status must be: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED'
      });
    }
    
    const order = await OrderService.updateOrderStatus(id, status as OrderStatus);
    
    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

// Update payment status (Admin only)
export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;
    
    if (!paymentStatus || !Object.values(PaymentStatus).includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Valid payment status is required. Status must be: PENDING, COMPLETED, FAILED, REFUNDED'
      });
    }
    
    const order = await OrderService.updatePaymentStatus(id, paymentStatus as PaymentStatus);
    
    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      data: order
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status',
      error: error.message
    });
  }
};

// Update tracking number (Admin only)
export const updateTrackingNumber = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { trackingNumber } = req.body;
    
    const order = await OrderService.updateTrackingNumber(id, trackingNumber);
    
    res.status(200).json({
      success: true,
      message: 'Tracking number updated successfully',
      data: order
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update tracking number',
      error: error.message
    });
  }
};

// Cancel order
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await OrderService.getOrderById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if user is authorized (order owner or admin)
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    
    if (order.userId !== userId && userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this order'
      });
    }
    
    // Check if order can be cancelled (only pending or processing orders)
    if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.PROCESSING) {
      return res.status(400).json({
        success: false,
        message: 'This order cannot be cancelled at this stage'
      });
    }
    
    const cancelledOrder = await OrderService.cancelOrder(id);
    
    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: cancelledOrder
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
};

// Delete order (Admin only)
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await OrderService.deleteOrder(id);
    
    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete order',
      error: error.message
    });
  }
};

// Get order statistics (Admin only)
export const getOrderStats = async (req: Request, res: Response) => {
  try {
    const stats = await OrderService.getOrderStats();
    
    res.status(200).json({
      success: true,
      message: 'Order statistics retrieved successfully',
      data: stats
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order statistics',
      error: error.message
    });
  }
};

// Search orders (Admin only)
export const searchOrders = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Search term is required'
      });
    }
    
    const orders = await OrderService.searchOrders(q);
    
    res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully',
      data: orders
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to search orders',
      error: error.message
    });
  }
};

// Get monthly revenue (Admin only)
export const getMonthlyRevenue = async (req: Request, res: Response) => {
  try {
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    
    const revenue = await OrderService.getMonthlyRevenue(year, month);
    
    res.status(200).json({
      success: true,
      message: 'Monthly revenue retrieved successfully',
      data: revenue
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve monthly revenue',
      error: error.message
    });
  }
};