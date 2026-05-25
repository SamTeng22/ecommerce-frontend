import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api';
import { Product } from '../../models/product.model';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  product: Product | null = null;
  quantity = 1;
  message = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.apiService.getProduct(+id).subscribe({
        next: (data: Product) => {
          this.product = data;
          this.cdr.detectChanges();
        },
        error: () => {
          this.message = 'Product not found';
          this.cdr.detectChanges();
        }
      });
    }
  }

  addToCart(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if(this.product) {
      this.loading = true;
      this.apiService.addToCart(this.product.id, this.quantity).subscribe({
        next: () => {
          this.message = "Added to cart!";
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.message = "Failed to add to cart.";
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  increaseQty(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQty(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
