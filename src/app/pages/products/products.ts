import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';
import { Product, ProductPage } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  allProducts: Product[] = [];
  currentPage = 0;
  totalPages = 0;
  loading = false;
  hasMore = false;

  selectedCategories: string[] = [];
  selectedPriceRanges: string[] = [];
  sortOption = 'featured';
  gridCols: 2 | 3 = 3;
  sortOpen = false;
  mobileSidebarOpen = false;
  categoryOpen = true;
  priceOpen = true;

  readonly priceRanges = [
    { label: 'Under $50', min: 0, max: 50 },
    { label: '$50 – $100', min: 50, max: 100 },
    { label: '$100 – $200', min: 100, max: 200 },
    { label: '$200+', min: 200, max: Infinity },
  ];

  readonly sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A–Z' },
  ];

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.apiService.getProducts(this.currentPage, 12).subscribe({
      next: (data: ProductPage) => {
        this.allProducts = [...this.allProducts, ...data.content];
        this.totalPages = data.totalPages;
        this.hasMore = this.currentPage < this.totalPages - 1;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('API Error:', err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  loadMore(): void {
    if (this.hasMore && !this.loading) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  get categories(): string[] {
    return Array.from(new Set(this.allProducts.map((p) => p.categoryName))).sort();
  }

  get filteredProducts(): Product[] {
    let results = [...this.allProducts];

    if (this.selectedCategories.length > 0) {
      results = results.filter((p) => this.selectedCategories.includes(p.categoryName));
    }

    if (this.selectedPriceRanges.length > 0) {
      results = results.filter((p) =>
        this.selectedPriceRanges.some((label) => {
          const range = this.priceRanges.find((r) => r.label === label);
          return range ? p.price >= range.min && p.price < range.max : false;
        })
      );
    }

    switch (this.sortOption) {
      case 'price-asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return results;
  }

  get activeFilterCount(): number {
    return this.selectedCategories.length + this.selectedPriceRanges.length;
  }

  toggleCategory(cat: string): void {
    const idx = this.selectedCategories.indexOf(cat);
    if (idx >= 0) this.selectedCategories.splice(idx, 1);
    else this.selectedCategories.push(cat);
  }

  isCategorySelected(cat: string): boolean {
    return this.selectedCategories.includes(cat);
  }

  togglePriceRange(label: string): void {
    const idx = this.selectedPriceRanges.indexOf(label);
    if (idx >= 0) this.selectedPriceRanges.splice(idx, 1);
    else this.selectedPriceRanges.push(label);
  }

  isPriceRangeSelected(label: string): boolean {
    return this.selectedPriceRanges.includes(label);
  }

  clearAll(): void {
    this.selectedCategories = [];
    this.selectedPriceRanges = [];
  }

  removeCategory(cat: string): void {
    this.selectedCategories = this.selectedCategories.filter((c) => c !== cat);
  }

  removePriceRange(label: string): void {
    this.selectedPriceRanges = this.selectedPriceRanges.filter((r) => r !== label);
  }

  setSort(value: string): void {
    this.sortOption = value;
    this.sortOpen = false;
  }

  getSortLabel(): string {
    return this.sortOptions.find((o) => o.value === this.sortOption)?.label ?? 'Featured';
  }

  getStockBadge(product: Product): string | null {
    if (product.stock === 0) return 'Out of Stock';
    if (product.stock <= 3) return 'Low Stock';
    return null;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.sort-dropdown')) {
      this.sortOpen = false;
    }
  }
}
