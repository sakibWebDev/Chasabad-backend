// services/email.service.ts
import nodemailer from 'nodemailer';
import { envVars } from '../config/env';

// Email কনফিগারেশন - envVars থেকে নেওয়া
const transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  port: parseInt(envVars.EMAIL_SENDER.SMTP_PORT),
  secure: false, // true for 465, false for 587
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // ডেভেলপমেন্টের জন্য
  },
});

// কানেকশন ভেরিফাই করার জন্য ফাংশন
export const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email service is ready to send emails');
    return true;
  } catch (error) {
    console.error('❌ Email service connection failed:', error);
    return false;
  }
};

export class EmailService {
  
  // ইমেইল পাঠানোর মূল ফাংশন
  static async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      const info = await transporter.sendMail({
        from: envVars.EMAIL_SENDER.SMTP_FROM || '"Chashi Vai" <noreply@krishibhandar.com>',
        to: to,
        subject: subject,
        html: html,
      });
      
      console.log(`✅ Email sent: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      return false;
    }
  }
  
  // Order Confirmation Email
  static async sendOrderConfirmation(orderData: any): Promise<boolean> {
    const customerEmail = orderData.user?.email || orderData.customerEmail;
    
    if (!customerEmail) {
      console.log('⚠️ No email found for customer, skipping email notification');
      return false;
    }
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-details { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
          .total { font-size: 24px; font-weight: bold; color: #059669; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          .button { background: #059669; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Order Confirmed!</h1>
            <p>Thank you for shopping with Chashi Vai</p>
          </div>
          <div class="content">
            <p>Dear ${orderData.user?.name || orderData.customerName || 'Valued Customer'},</p>
            <p>Your order has been successfully placed and is now being processed.</p>
            
            <div class="order-details">
              <h3>Order Summary</h3>
              <p><strong>Order ID:</strong> ${orderData.orderId}</p>
              <p><strong>Order Date:</strong> ${new Date(orderData.createdAt).toLocaleString('bn-BD')}</p>
              <p><strong>Payment Method:</strong> ${orderData.payment_method === 'cod' ? 'Cash on Delivery' : orderData.payment_method}</p>
              <p><strong>Status:</strong> ${orderData.status}</p>
              
              <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
                <thead>
                  <tr><th style="text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb;">Product</th>
                    <th style="text-align: center; padding: 8px; border-bottom: 1px solid #e5e7eb;">Qty</th>
                    <th style="text-align: right; padding: 8px; border-bottom: 1px solid #e5e7eb;">Price</th>
                    <th style="text-align: right; padding: 8px; border-bottom: 1px solid #e5e7eb;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${orderData.items?.map((item: any) => `
                    <tr>
                      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
                      <td style="text-align: center; padding: 8px; border-bottom: 1px solid #e5e7eb;">${item.quantity}</td>
                      <td style="text-align: right; padding: 8px; border-bottom: 1px solid #e5e7eb;">৳${item.unit_price}</td>
                      <td style="text-align: right; padding: 8px; border-bottom: 1px solid #e5e7eb;">৳${item.total_price}</td>
                    </tr>
                  `).join('') || '<tr><td colspan="4">No items found</td></tr>'}
                </tbody>
              </table>
              
              <div style="margin-top: 15px;">
                <p><strong>Subtotal:</strong> ৳${orderData.total_amount}</p>
                <p><strong>Shipping:</strong> ${orderData.shipping_cost === 0 ? 'Free' : `৳${orderData.shipping_cost}`}</p>
                ${orderData.discount > 0 ? `<p><strong>Discount:</strong> - ৳${orderData.discount}</p>` : ''}
                <p class="total"><strong>Total:</strong> ৳${orderData.grand_total}</p>
              </div>
            </div>
            
            <div>
              <h3>Shipping Address</h3>
              <p>
                ${orderData.shipping_address}<br>
                Phone: ${orderData.shipping_phone}
              </p>
            </div>
            
            <div style="text-align: center;">
              <a href="${envVars.FRONTEND_URL}/orders/${orderData.id}" class="button">Track Your Order</a>
            </div>
          </div>
          
          <div class="footer">
            <p>Need help? Contact us: support@krishibhandar.com</p>
            <p>© 2024 Chashi Vai - Krishi Bhandar. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    return await this.sendEmail(customerEmail, `Order Confirmed! - ${orderData.orderId}`, html);
  }
  
  // Order Status Update Email
  static async sendOrderStatusUpdate(orderData: any): Promise<boolean> {
    const customerEmail = orderData.user?.email || orderData.customerEmail;
    
    if (!customerEmail) {
      console.log('⚠️ No email found for customer, skipping email notification');
      return false;
    }
    
    const statusMessages: Record<string, string> = {
      PROCESSING: 'Your order is being processed and will be ready soon.',
      SHIPPED: `Your order has been shipped! Tracking number: ${orderData.tracking_number || 'Will be updated soon'}`,
      DELIVERED: 'Your order has been delivered. Thank you for shopping with us!',
      CANCELLED: 'Your order has been cancelled as requested.'
    };
    
    const message = statusMessages[orderData.status] || `Your order status has been updated to: ${orderData.status}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 30px; }
          .status { font-size: 18px; font-weight: bold; color: #059669; }
          .button { background: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Status Update</h1>
            <p>Order #${orderData.orderId}</p>
          </div>
          <div class="content">
            <p>Dear Customer,</p>
            <p>${message}</p>
            <div style="text-align: center;">
              <a href="${envVars.FRONTEND_URL}/orders/${orderData.id}" class="button">View Order Details</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    
    return await this.sendEmail(customerEmail, `Order Status Update - ${orderData.orderId}`, html);
  }
}