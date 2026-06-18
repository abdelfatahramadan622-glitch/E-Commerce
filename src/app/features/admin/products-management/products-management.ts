import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsService } from '../../../core/services/products.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-products-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products-management.html',
  styleUrls: ['./products-management.css']
})
export class ProductsManagementComponent {
  private productsService = inject(ProductsService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  products = this.productsService.products;
  categories = this.productsService.categories;
  editingProductId: number | null = null;

  productForm = this.fb.group({
    title: ['', Validators.required],
    price: [0, Validators.required],
    category: ['', Validators.required],
    description: ['', Validators.required],
    image: ['', Validators.required]
  });

  onEdit(prod: Product) {
    this.editingProductId = prod.id;
    this.productForm.patchValue({
      title: prod.title,
      price: prod.price,
      category: prod.category,
      description: prod.description,
      image: prod.image
    });
    this.cdr.detectChanges();
  }

  resetForm() {
    this.editingProductId = null;
    this.productForm.reset({ price: 0 });
  }

  onDelete(id: number) {
    if (confirm('هل أنت متأكد من الحذف؟')) {
      this.productsService.deleteProduct(id);
    }
  }

  onSubmitProduct() {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      if (this.editingProductId !== null) {
        this.productsService.updateProduct({ id: this.editingProductId, ...formValue } as Product);
      } else {
        this.productsService.addProduct(formValue as Product);
      }
      this.resetForm();
    }
  }
}