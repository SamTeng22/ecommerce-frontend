import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { Product, ProductPage } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  products: Product[] = []
  currentPage = 0;
  totalPages = 0;
  loading = false;

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.apiService.getProducts(this.currentPage)
      .subscribe({
        next: (data: ProductPage) => {
          console.log('API Response:', data);  // ← add this
          console.log('Content:', data.content);      // ← add
          console.log('Products before:', this.products);
          this.products = [...data.content];
          console.log('Products after:', this.products);  
          this.totalPages = data.totalPages;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.log('API Error: ', err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  prevPage() :  void { 
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadProducts();
    }
  }
}
