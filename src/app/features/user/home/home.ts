import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsService } from '../../../core/services/products.service';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  // حقن الخدمة المركزية للمنتجات بنظام inject الحديث
  private productsService = inject(ProductsService);

  // قراءة الـ Signals من الـ Service مباشرة
  products = this.productsService.products;
  categories = this.productsService.categories;
}