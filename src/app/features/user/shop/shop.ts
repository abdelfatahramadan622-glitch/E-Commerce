import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../../core/services/products.service';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './shop.html',
  styleUrls: ['./shop.css']
})
export class ShopComponent implements OnInit {
  // حقن الخدمات بنظام inject الحديث
  private productsService = inject(ProductsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // قراءة الـ Signals الأساسية من السيرفيس
  categories = this.productsService.categories;
  private products = this.productsService.products;

  // الـ Signals المحلية الخاصة بحالة الفلترة في الصفحة
  selectedCategory = signal<string>('الكل');
  maxPrice = signal<number>(2000); // القيمة الابتدائية للرينج

  // الـ Signal السحري المشترك (computed) لفلترة الأقسام والسعر معاً تلقائياً
  filteredProducts = computed(() => {
    const activeCategory = this.selectedCategory();
    const activeMaxPrice = this.maxPrice();

    return this.products().filter(prod => {
      // 1. شرط القسم
      const matchesCategory = activeCategory === 'الكل' || 
        prod.category.toLowerCase() === activeCategory.toLowerCase();

      // 2. شرط السعر
      const matchesPrice = prod.price <= activeMaxPrice;

      // يجب أن ينجح المنتج في الشرطين معاً ليتم عرضه
      return matchesCategory && matchesPrice;
    });
  });

  ngOnInit(): void {
    // مراقبة الرابط (queryParams) عشان لو المستخدم جاي من الـ Home يلقط القسم فوراً
    this.route.queryParams.subscribe(params => {
      const categoryParam = params['category'];
      if (categoryParam) {
        this.selectedCategory.set(categoryParam);
      } else {
        this.selectedCategory.set('الكل');
      }
    });
  }

  // الدالة المسؤولية عن تغيير القسم عند الضغط على الأزرار
  changeCategory(cat: string): void {
    this.selectedCategory.set(cat);
    
    // تحديث الرابط في المتصفح بشكل احترافي عشان يتطابق مع الاختيار الحالي
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: cat === 'الكل' ? null : cat }, // لو اختار الكل بنشيل البارامتر من اللينك لتنظيفه
      queryParamsHandling: 'merge'
    });
  }

  // الدالة المسؤولة عن تحديث الـ Range بتاع السعر لحظياً
  updatePriceFilter(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.maxPrice.set(Number(inputElement.value));
  }
}