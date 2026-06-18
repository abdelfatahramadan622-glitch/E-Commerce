import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product.model';

// 1. تحديد شكل عنصر السلة (المنتج + الكمية المطلوبة منه)
export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // الـ Signal الأساسي المسؤول عن تخزين عناصر السلة
  private cartItemsSignal = signal<CartItem[]>([]);

  // Read-only signal لقراءة عناصر السلة بأمان من المكونات الأخرى
  readonly cartItems = this.cartItemsSignal.asReadonly();

  // حساب إجمالي عدد المنتجات في السلة تلقائياً (سيسمع في الـ Navbar فوراً)
  readonly cartCount = computed(() => {
    return this.cartItemsSignal().reduce((acc, item) => acc + item.quantity, 0);
  });

  // حساب إجمالي المبلغ المطلوب دفعه تلقائياً
  readonly cartTotal = computed(() => {
    return this.cartItemsSignal().reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  });

  // دالة إضافة منتج للسلة
  addToCart(product: Product) {
    const items = this.cartItemsSignal();
    const existingItem = items.find(item => item.product.id === product.id);

    if (existingItem) {
      // لو المنتج موجود، نزود الكمية
      this.cartItemsSignal.update(currentItems =>
        currentItems.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      // لو منتج جديد، نضيفه للسلة
      this.cartItemsSignal.update(currentItems => [...currentItems, { product, quantity: 1 }]);
    }
  }

  // دالة تقليل الكمية أو حذف المنتج لو تساوت مع 1
  decreaseQuantity(productId: number) {
    const items = this.cartItemsSignal();
    const existingItem = items.find(item => item.product.id === productId);

    if (existingItem && existingItem.quantity > 1) {
      this.cartItemsSignal.update(currentItems =>
        currentItems.map(item =>
          item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
      );
    } else {
      this.removeFromCart(productId);
    }
  }

  // دالة حذف منتج نهائياً من السلة
  removeFromCart(productId: number) {
    this.cartItemsSignal.update(currentItems =>
      currentItems.filter(item => item.product.id !== productId)
    );
  }

  // دالة تفريغ السلة بالكامل بعد إتمام الشراء
  clearCart() {
    this.cartItemsSignal.set([]);
  }
}