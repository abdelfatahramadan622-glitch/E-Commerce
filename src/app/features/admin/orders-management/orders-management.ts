import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../../core/services/orders.service';

@Component({
  selector: 'app-orders-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders-management.html',
  styleUrls: ['./orders-management.css']
})
export class OrdersManagementComponent {
  // حقن السيرفس عشان نقرأ الطلبات
  private ordersService = inject(OrdersService);
  
  // الـ Signal اللي بيسمع لأي طلب جديد يجي من السلة
  orders = this.ordersService.orders;

  // دالة تحديث الحالة (بتنادي دالة السيرفس)
  updateStatus(orderId: string, newStatus: 'Pending' | 'Shipped' | 'Delivered') {
    this.ordersService.updateStatus(orderId, newStatus);
  }
}