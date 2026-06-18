import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css']
})
export class ProductCardComponent {
  // 1. استقبال بيانات المنتج كـ Signal Input إجباري ومحمي
  product = input.required<Product>();

  // 2. حقن خدمة السلة المركزية باستخدام دالة inject الحديثة
  private cartService = inject(CartService);

  // 3. دالة إضافة المنتج إلى عربة التسوق عند الضغط على الزر في الـ HTML
  addToCart() {
    this.cartService.addToCart(this.product());
  }
}