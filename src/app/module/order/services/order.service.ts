// services/order.service.ts

import { prisma } from '../../../lib/prisma';
import { OrderStatus, PaymentStatus } from '../../../../generated/prisma/enums';
import { EmailService } from '../../../utils/notifications'; // SMS যোগ করুন

export interface CreateOrderInput {
  email: string;           
  userId: string;
  items: {
    seedId: string;
    name: string;           // ✅ name প্রপার্টি যোগ করুন
    unit_price: number;
    quantity: number;
    total_price: number;
  }[];
  total_amount: number;
  discount?: number;
  tax?: number;
  shipping_cost?: number;
  grand_total: number;
  payment_method?: string;
  shipping_address: string;
  shipping_phone: string;
  notes?: string;
}

export class OrderService {
  
  // Create new order with items
  static async createOrder(userId: string, email: string, data: CreateOrderInput) {

    console.log('📝 Creating order for user:', userId, 'with email:', email);
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    console.log('📝 Creating order with ID:', orderId);
    
    // Start transaction to create order and items
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const order = await tx.order.create({
        data: {
          orderId,
          userId,
          total_amount: data.total_amount,
          discount: data.discount || 0,
          tax: data.tax || 0,
          shipping_cost: data.shipping_cost || 0,
          grand_total: data.grand_total,
          payment_method: data.payment_method,
          shipping_address: data.shipping_address,
          shipping_phone: data.shipping_phone,
          notes: data.notes,
          status: OrderStatus.PENDING,
          payment_status: PaymentStatus.PENDING,
        }
      });
      
      // Create order items with correct field names
      if (data.items && data.items.length > 0) {
        await tx.orderItem.createMany({
          data: data.items.map((item) => ({
            orderId: order.id,
            seedId: item.seedId,
            name: item.name,              // ✅ এখন কাজ করবে
            unit_price: item.unit_price,
            quantity: item.quantity,
            total_price: item.total_price,
          })),
        });
      }
      
      return order;
    });
    
   // Send email notification (আপনার user email এর সাথে)
    const orderWithDetails = await this.getOrderById(order.id);

    console.log('📧 Order created with details:', orderWithDetails); 

    if (orderWithDetails) {
      console.log('📧 Sending order confirmation email to:', email);
      EmailService.sendOrderConfirmation(orderWithDetails).catch(err => {
        console.error('Email notification failed:', err);
      });
    }
    
    return order;
  }
  
  // باقی সব মেথড আগের মতোই থাকবে...
  static async getAllOrders(page: number = 1, limit: number = 20, status?: string) {
    const skip = (page - 1) * limit;
    const where = status ? { status: status as OrderStatus } : {};
    
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            }
          },
          items: true
        }
      }),
      prisma.order.count({ where })
    ]);
    
    return { orders, total, page, totalPages: Math.ceil(total / limit), limit };
  }
  
  static async getUserOrders(userId: string) {
    return await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { items: true }
    });
  }
  
  static async getOrderById(id: string) {
    return await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
          }
        },
        items: true
      }
    });
  }
  
  static async getOrderByOrderId(orderId: string) {
    return await prisma.order.findUnique({
      where: { orderId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          }
        },
        items: true
      }
    });
  }
  
  static async updateOrderStatus(id: string, status: OrderStatus) {
    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });
    
    // Status update email পাঠান
    EmailService.sendOrderStatusUpdate(order).catch(err => {
      console.error('Status update email failed:', err);
    });
    
    return order;
  }
  
  static async updatePaymentStatus(id: string, paymentStatus: PaymentStatus) {
    return await prisma.order.update({
      where: { id },
      data: { payment_status: paymentStatus }
    });
  }
  
  static async updateTrackingNumber(id: string, trackingNumber: string) {
    return await prisma.order.update({
      where: { id },
      data: { tracking_number: trackingNumber }
    });
  }
  
  static async cancelOrder(id: string) {
    const order = await prisma.order.update({
      where: { id },
      data: { status: OrderStatus.CANCELLED }
    });
    return order;
  }
  
  static async deleteOrder(id: string) {
    return await prisma.$transaction(async (tx) => {
      await tx.orderItem.deleteMany({ where: { orderId: id } });
      await tx.order.delete({ where: { id } });
    });
  }
  
  static async getOrderStats() {
    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      prisma.order.count({ where: { status: OrderStatus.PROCESSING } }),
      prisma.order.count({ where: { status: OrderStatus.SHIPPED } }),
      prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
      prisma.order.count({ where: { status: OrderStatus.CANCELLED } }),
      prisma.order.aggregate({
        where: { status: OrderStatus.DELIVERED },
        _sum: { grand_total: true }
      })
    ]);
    
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } },
        items: { take: 3 }
      }
    });
    
    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue: totalRevenue._sum.grand_total || 0,
      recentOrders
    };
  }
  
  static async searchOrders(searchTerm: string) {
    return await prisma.order.findMany({
      where: {
        OR: [
          { orderId: { contains: searchTerm, mode: 'insensitive' } },
          { shipping_address: { contains: searchTerm, mode: 'insensitive' } },
          { shipping_phone: { contains: searchTerm } },
          { tracking_number: { contains: searchTerm, mode: 'insensitive' } },
          { user: { name: { contains: searchTerm, mode: 'insensitive' } } },
          { user: { email: { contains: searchTerm, mode: 'insensitive' } } },
          { user: { phone: { contains: searchTerm } } }
        ]
      },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        items: true
      }
    });
  }
  
  static async getMonthlyRevenue(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    const revenue = await prisma.order.aggregate({
      where: {
        status: OrderStatus.DELIVERED,
        createdAt: { gte: startDate, lte: endDate }
      },
      _sum: { grand_total: true }
    });
    
    const orderCount = await prisma.order.count({
      where: {
        status: OrderStatus.DELIVERED,
        createdAt: { gte: startDate, lte: endDate }
      }
    });
    
    return { year, month, revenue: revenue._sum.grand_total || 0, orderCount };
  }
}