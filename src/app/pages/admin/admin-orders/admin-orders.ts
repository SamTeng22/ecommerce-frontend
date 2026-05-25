import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../../services/api';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-admin-orders',
  imports: [FormsModule, DatePipe],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css',
})
export class AdminOrders implements OnInit {
  orders: Order[] = [];
  loading = false;
  message = '';
  statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.apiService.getAllOrders().subscribe({
      next: (data: Order[]) => {
        this.orders = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.message = 'Failed to load orders';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  updateStatus(orderId: number, status: string): void {
    this.apiService.updateOrderStatus(orderId, status).subscribe({
      next: () => {
        this.message = `Order #${orderId} updated to ${status}`;
        this.loadOrders();
        this.cdr.detectChanges();
      },
      error: () => {
        this.message = 'Failed to update order status';
        this.cdr.detectChanges();
      }
    });
  }
}
