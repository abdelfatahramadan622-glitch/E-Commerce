import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  private cartService = inject(CartService);
  cartCount = this.cartService.cartCount; // سيقرأ مباشرة من السيرفيس بشكل ديناميكي!
}