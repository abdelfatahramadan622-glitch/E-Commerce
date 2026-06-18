import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../core/services/products.service';
import { CartService } from '../../../core/services/cart';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-overview.html',
  styleUrls: ['./dashboard-overview.css']
})
export class DashboardOverviewComponent {
  private productsService = inject(ProductsService);
  private cartService = inject(CartService);

  // 1. حساب عدد المنتجات الإجمالي في المتجر ديناميكياً
  totalProductsCount = computed(() => this.productsService.products().length);

  // 2. إحصائيات وهمية محاكية للواقع للـ Dashboard
  totalSales = signal<number>(24500); // إجمالي المبيعات بالجنية
  totalOrdersCount = signal<number>(38); // عدد الطلبات الإجمالي

  // 3. قائمة بآخر الحركات أو الأنشطة التي تمت (Recent Activity)
  recentActivities = signal([
    { id: 1, text: 'قام عميل بشراء "ساعة ذكية رياضية Pro"', time: 'منذ 5 دقائق', type: 'success' },
    { id: 2, text: 'تم تحديث سعر "سماعات بلوتوث عازلة للصوت"', time: 'منذ ساعتين', type: 'info' },
    { id: 3, text: 'طلب جديد في انتظار التجهيز برقم #1024', time: 'منذ 4 ساعات', type: 'warning' }
  ]);
}