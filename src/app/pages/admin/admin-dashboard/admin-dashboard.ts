import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  totalProducts = 0;
  totalOrders = 0;
  pendingOrders = 0;
  loading = false;

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.apiService.getProducts(0,100).subscribe({
      next: (data) => {
        this.totalProducts = data.totalElements;
        this.cdr.detectChanges();
      }
    });
    this.apiService.getAllOrders().subscribe({
      next: (data) => {
        this.totalOrders = data.length;
        this.pendingOrders = data.filter((o: any) => o.status === 'PENDING').length;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
