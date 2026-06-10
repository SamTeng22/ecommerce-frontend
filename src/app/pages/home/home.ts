import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';
import { Product, ProductPage } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  featuredProducts: Product[] = [];
  categories: any[] = [];
  loading = false;
  selectedFilter = 'All';

  readonly staticCategories = [
    {
      id: 1, name: 'Women', description: 'New season essentials', count: '320+ styles',
      image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=1000&fit=crop&auto=format',
    },
    {
      id: 2, name: 'Accessories', description: 'Bags, jewellery & more', count: '140+ pieces',
      image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&h=600&fit=crop&auto=format',
    },
    {
      id: 3, name: 'Home', description: 'Curated living', count: '95+ items',
      image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=600&fit=crop&auto=format',
    },
    {
      id: 4, name: 'Footwear', description: 'Step into the season', count: '80+ styles',
      image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&h=600&fit=crop&auto=format',
    },
    {
      id: 5, name: 'Beauty', description: 'Skincare & cosmetics', count: '60+ products',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=600&fit=crop&auto=format',
    },
  ];

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadFeaturedProducts();
    this.loadCategories();
  }

  loadCategories(): void {
    this.apiService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.detectChanges();
      }
    });
  }

  loadFeaturedProducts(): void {
    this.loading = true;
    this.apiService.getProducts(0, 8).subscribe({
      next: (data: ProductPage) => {
        this.featuredProducts = [...data.content];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get filters(): string[] {
    const cats = [...new Set(this.featuredProducts.map(p => p.categoryName))];
    return ['All', ...cats];
  }

  get filteredProducts(): Product[] {
    if (this.selectedFilter === 'All') return this.featuredProducts;
    return this.featuredProducts.filter(p => p.categoryName === this.selectedFilter);
  }

  setFilter(filter: string): void {
    this.selectedFilter = filter;
  }
}
