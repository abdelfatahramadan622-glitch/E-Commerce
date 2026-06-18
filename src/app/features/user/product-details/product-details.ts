import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser'; // خدمات الأنجولار الخاصة بالـ SEO
import { ProductsService } from '../../../core/services/products.service';
import { CartService } from '../../../core/services/cart'; // استيراد خدمة السلة
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.css']
})
export class ProductDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productsService = inject(ProductsService);
  private cartService = inject(CartService); // حقن خدمة السلة هنا
  private titleService = inject(Title); // خدمة التحكم في عنوان المتصفح
  private metaService = inject(Meta);   // خدمة التحكم في الـ Meta Tags

  // الـ Signal الذي سيحمل المنتج الحالي المعروض في الصفحة
  product = signal<Product | undefined>(undefined);

  ngOnInit() {
    // 1. التقاط الـ ID من رابط الصفحة (Route Parameter)
    const productId = Number(this.route.snapshot.paramMap.get('id'));

    if (productId) {
      // 2. جلب بيانات المنتج من الخدمة المركزية
      const foundProduct = this.productsService.getProductById(productId);

      if (foundProduct) {
        this.product.set(foundProduct);

        // 3. تطبيق سحر الـ SEO الديناميكي للمنتج
        this.updateSEO(foundProduct);
      }
    }
  }

  // دالة إضافة المنتج إلى عربة التسوق عند الضغط على الزر في الـ HTML
  addToCart() {
    const currentProduct = this.product();
    if (currentProduct) {
      this.cartService.addToCart(currentProduct);
      alert(`تم إضافة ${currentProduct.title} إلى عربة التسوق بنجاح! 🎉`);
    }
  }

  // ======= 🚀 دوال تأثير تكبير الصورة والعدسة المضافة حديثاً =======

  // 1. دالة تأثير الزوم عند حركة الماوس فوق الحاوية
  zoomImage(event: MouseEvent): void {
    const container = event.currentTarget as HTMLElement;
    const img = container.querySelector('.main-product-image') as HTMLImageElement;
    
    if (img) {
      // حساب موقع الماوس بالنسبة لأبعاد الحاوية
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      
      // تحريك بؤرة الصورة وتكبيرها بمقدار ضعف ونصف (1.8) لخلق تأثير العدسة
      img.style.transformOrigin = `${x}% ${y}%`;
      img.style.transform = 'scale(1.8)';
    }
  }

  // 2. دالة إرجاع الصورة لحجمها الطبيعي عند خروج الماوس
  resetZoom(event: MouseEvent): void {
    const container = event.currentTarget as HTMLElement;
    const img = container.querySelector('.main-product-image') as HTMLImageElement;
    
    if (img) {
      img.style.transformOrigin = 'center center';
      img.style.transform = 'scale(1)';
    }
  }

  // ===============================================================

  // دالة مخصصة لتحديث الـ Meta Tags الخاصة بالـ SEO لتجهيز الصفحة لمحركات البحث
  private updateSEO(product: Product) {
    // تغيير عنوان التبويب في المتصفح
    this.titleService.setTitle(`${product.title} - متجرنا الإلكتروني`);

    // تحديث الـ Meta Tags الأساسية والـ Open Graph (المستخدمة في فيسبوك ولينكد إن)
    this.metaService.updateTag({ name: 'description', content: product.description });
    this.metaService.updateTag({ property: 'og:title', content: product.title });
    this.metaService.updateTag({ property: 'og:description', content: product.description });
    this.metaService.updateTag({ property: 'og:image', content: product.image });
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
  }
}