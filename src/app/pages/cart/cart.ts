import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {ApiService} from '../../services/api';
import { Cart as CartModel } from '../../models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})

export class Cart implements OnInit {
  cart: CartModel | null = null;
  message = '';
  isError = false;
  loading = false;
  checkingOut = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() : void {
    this.loading = true;
    this.apiService.getCart().subscribe({
      next: (data: CartModel) => {
        this.cart = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.message = 'Failed to load cart';
        this.isError = true;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  removeItem(cartItemId: number) : void {
    this.apiService.removeFromCart(cartItemId).subscribe({
      next: (data: CartModel) => {
        this.cart = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.message = 'Failed to remove item';
        this.isError = true;
        this.cdr.detectChanges();
      }
    });
  }

  checkout(): void {
    this.checkingOut = true;
    this.apiService.checkout().subscribe({
      next: () => {
        this.message = 'Order placed successfully!';
        this.isError = false;
        this.checkingOut = false;
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/orders']), 1500);
      },
      error: () => {
        this.message = 'Checkout failed. Please try again.';
        this.isError = true;
        this.checkingOut = false;
        this.cdr.detectChanges();
      }
    });
  }
}
