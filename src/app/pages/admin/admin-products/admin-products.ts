import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../models/product.model';
import { ApiService } from '../../../services/api';

@Component({
  selector: 'app-admin-products',
  imports: [FormsModule],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css',
})

export class AdminProducts implements OnInit {
  products: Product[] = [];
  categories: any[] = [];
  loading = false;
  message = '';
  showForm = false;
  editingProduct: any = null;

  form = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: null as number | null
  };

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.loading = true;
    this.apiService.getProducts(0,100).subscribe({
      next: (data) => {
        this.products = [...data.content];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadCategories(): void {
    this.apiService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.detectChanges();
      }
    });
  }

  openCreateForm(): void {
    this.editingProduct = null;
    this.form = { name: '', description: '', price: 0, stock: 0, categoryId: null };
    this.showForm = true;
  }

  openEditForm(product: Product): void {
    this.editingProduct = product;
    this.form = {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId
    };
    this.showForm = true;
  }

  saveProduct(): void {
    if (this.editingProduct) {
      this.apiService.updateProduct(this.editingProduct.id, this.form).subscribe({
        next: () => {
          this.message = 'Product updated!';
          this.showForm = false;
          this.loadProducts();
          this.cdr.detectChanges();
        },
        error: () => {
          this.message = 'Failed to update product';
          this.cdr.detectChanges;
        }
      });
    } else {
      this.apiService.createProduct(this.form).subscribe({
        next: () => {
          this.message = 'Product created!';
          this.showForm = false;
          this.loadProducts();
          this.cdr.detectChanges();
        },
        error: () => {
          this.message = 'Failed to create product';
          this.cdr.detectChanges;
        }
      });
    }
  }

  deleteProduct(id: number): void {
    if(confirm('Are you sure you want to delete this product?')) {
      this.apiService.deleteProduct(id).subscribe({
        next: () => {
          this.message = 'Product deleted!';
          this.loadProducts();
          this.cdr.detectChanges();
        },
        error: () => {
          this.message = 'Failed to delete product';
          this.cdr.detectChanges;
        }
      });
    }
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingProduct = null;
  }
}
