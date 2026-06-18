import { Injectable, signal } from '@angular/core';

export interface Order {
  id: string;
  customerName: string;
  address?: string;
  phone: string;
  total: number;
  date: string | Date;
  status: 'Pending' | 'Shipped' | 'Delivered';
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  // القائمة تبدأ فارغة تماماً
  private ordersSignal = signal<Order[]>([]);

  readonly orders = this.ordersSignal.asReadonly();

  // إضافة طلب جديد (سيظهر فوراً في صفحة الأدمن)
  addOrder(order: Order) {
    this.ordersSignal.update(list => [...list, order]);
  }

  // تحديث حالة الطلب
  updateStatus(orderId: string, status: 'Pending' | 'Shipped' | 'Delivered') {
    this.ordersSignal.update(list => 
      list.map(o => o.id === orderId ? { ...o, status } : o)
    );
  }

  // (اختياري) لو عايز تحذف طلب معين
  deleteOrder(orderId: string) {
    this.ordersSignal.update(list => list.filter(o => o.id !== orderId));
  }
}