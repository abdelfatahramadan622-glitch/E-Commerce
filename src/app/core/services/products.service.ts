import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  // الـ Signal الأساسي الذي يحتوي على قائمة المنتجات بالكامل (Private لحمايته)
  private productsSignal = signal<Product[]>([
    {
      id: 1,
      title: 'ساعة ذكية رياضية Pro',
      price: 1200,
      description: 'ساعة ذكية مقاومة للماء مع مستشعر نبضات القلب وشاشة أموليد.',
      category: 'إلكترونيات',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      rating: { rate: 4.5, count: 120 }
    },
    {
      id: 2,
      title: 'سماعات بلوتوث عازلة للصوت',
      price: 850,
      description: 'سماعات رأس لاسلكية مع تقنية إلغاء الضوضاء النشطة وبطارية تدوم 40 ساعة.',
      category: 'إلكترونيات',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      rating: { rate: 4.8, count: 85 }
    },
    {
      id: 3,
      title: 'حذاء جري مريح خفيف الوزن',
      price: 600,
      description: 'حذاء رياضي مصمم للجري الطويل وتوفير أقصى درجات الراحة للقدمين.',
      category: 'ملابس وأحذية',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      rating: { rate: 4.2, count: 210 }
    },
    {
      id: 4,
      title: 'نظارة شمسية كلاسيكية كاجوال',
      price: 350,
      description: 'نظارة شمسية عصرية بعدسات مستقطبة لحماية العين من الأشعة فوق البنفسجية.',
      category: 'إكسسوارات',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
      rating: { rate: 4.0, count: 45 }
    }
  ]);

  // Read-only Signal لكي تقرأ منه المكونات الخارجية بأمان دون تعديل مباشر
  readonly products = this.productsSignal.asReadonly();

  // ميزة الـ Computed Signal: جلب الأقسام الفريدة تلقائياً دون تكرار كود
  readonly categories = computed(() => {
    const allCategories = this.productsSignal().map(p => p.category);
    return ['الكل', ...new Set(allCategories)];
  });

  constructor() { }

  // دالة لجلب منتج واحد محدد عبر الـ ID الخاص به
  getProductById(id: number): Product | undefined {
    return this.productsSignal().find(p => p.id === id);
  }

  // 1. دالة إضافة منتج جديد في أول القائمة
  addProduct(newProduct: Omit<Product, 'id' | 'rating'>) {
    const currentProducts = this.productsSignal();
    // توليد ID تلقائي بسيط للمنتج الجديد
    const nextId = currentProducts.length > 0 ? Math.max(...currentProducts.map(p => p.id)) + 1 : 1;

    const fullProduct: Product = {
      ...newProduct,
      id: nextId,
      rating: { rate: 0, count: 0 } // تقييم مبدئي صفري للمنتج الجديد
    };

    this.productsSignal.update(products => [fullProduct, ...products]);
  }


  // في ملف products.service.ts
  updateProduct(updatedProduct: Product): void {
    // الـ products هنا هو الـ WritableSignal
    this.productsSignal.update(items => 
      items.map(item => item.id === updatedProduct.id ? { ...item, ...updatedProduct } : item)
    );
  }

  // 2. دالة حذف منتج بناءً على الـ ID
  deleteProduct(id: number) {
    this.productsSignal.update(products => products.filter(p => p.id !== id));
  }



}