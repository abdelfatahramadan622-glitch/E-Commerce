import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../../core/services/cart';
import { OrdersService } from '../../../core/services/orders.service'; // استيراد الخدمة الجديدة

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent {
  cartService = inject(CartService);
  private fb = inject(FormBuilder);
  private ordersService = inject(OrdersService); // حقن الخدمة

  cartItems = this.cartService.cartItems;
  cartTotal = this.cartService.cartTotal;

  checkoutForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(6)]],
    address: ['', [Validators.required, Validators.minLength(10)]],
    phone: ['', [Validators.required, Validators.pattern(/^01[0125]\d{8}$/)]],
    paymentMethod: ['cash', Validators.required]
  });

submitOrder() {
    if (this.checkoutForm.valid) {
      // 1. تجهيز الطلب
      const newOrder = {
        id: 'ORD-' + Date.now(), // حولنا الـ id لـ string عشان يتطابق مع الـ Interface
        customerName: this.checkoutForm.value.fullName!,
        address: this.checkoutForm.value.address!,
        phone: this.checkoutForm.value.phone!,
        items: this.cartItems(),
        total: this.cartTotal(),
        date: new Date(),
        status: 'Pending' as 'Pending' | 'Shipped' | 'Delivered' // التعديل هنا: نختار قيمة واحدة فقط
      };

      // 2. إرسال الطلب للأدمن
      this.ordersService.addOrder(newOrder);

      // 3. رسالة تأكيد وتنظيف العربة
      alert('تم استلام طلبك بنجاح! شكراً لتسوقك معنا.');
      this.cartService.clearCart();
      this.checkoutForm.reset({ paymentMethod: 'cash' });
      
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }
}