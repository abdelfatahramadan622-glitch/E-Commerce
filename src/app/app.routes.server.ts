import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // 1. استثناء مسار تفاصيل المنتج الديناميكي وجعله يشتغل برندر لحظي من السيرفر أو الكلاينت
  {
    path: 'product/:id',
    renderMode: RenderMode.Server // أو RenderMode.Client
  },
  
  // 2. باقي مسارات الموقع المستقرة (الرئيسية، السلة، المتجر) يفضل يتعملها Prerender عادي جداً
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];