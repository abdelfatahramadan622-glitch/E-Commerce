import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/user/home/home').then(m => m.HomeComponent),
    title: 'الرئيسية - متجر إلكتروني متكامل'
  },
  {
    path: 'shop',
    loadComponent: () => import('./features/user/shop/shop').then(m => m.ShopComponent),
    title: 'تصفح المنتجات - متجرنا'
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./features/user/product-details/product-details').then(m => m.ProductDetailsComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/user/cart/cart').then(m => m.CartComponent),
    title: 'عربة التسوق'
  },

  // ================== مسارات لوحة تحكم الأدمن الجديدة ==================
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-layout/admin-layout').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      {
        path: 'overview',
        loadComponent: () => import('./features/admin/dashboard-overview/dashboard-overview').then(m => m.DashboardOverviewComponent),
        title: 'لوحة التحكم - الإحصائيات'
      },
      {
        path: 'products',
        loadComponent: () => import('./features/admin/products-management/products-management').then(m => m.ProductsManagementComponent),
        title: 'لوحة التحكم - إدارة المنتجات'
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/admin/orders-management/orders-management').then(m => m.OrdersManagementComponent),
        title: 'لوحة التحكم - إدارة الطلبات'
      }
    ]
  },

  { path: '**', redirectTo: '', pathMatch: 'full' }
];