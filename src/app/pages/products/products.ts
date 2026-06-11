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
  allProductsCache: Product[] | null = null;
  allCategories: string[] = [];
  currentPage = 0;
  totalPages = 0;
  loading = false;
  filterLoading = false;
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
    { label: 'Under ₱500', min: 0, max: 500 },
    { label: '₱500 – ₱1,000', min: 500, max: 1000 },
    { label: '₱1,000 – ₱3,000', min: 1000, max: 3000 },
    { label: '₱3,000+', min: 3000, max: Infinity },
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
    this.loadCategories();
  }

  loadCategories(): void {
    this.apiService.getCategories().subscribe({
      next: (cats: any[]) => {
        this.allCategories = cats.map((c: any) => c.name ?? c).sort();
        this.cdr.detectChanges();
      },
    });
  }

  fetchAllProducts(): void {
    this.filterLoading = true;
    this.apiService.getProducts(0, 9999).subscribe({
      next: (data: ProductPage) => {
        this.allProductsCache = data.content;
        this.filterLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.filterLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onFilterChange(): void {
    if (this.isFiltered && !this.allProductsCache) {
      this.fetchAllProducts();
    } else {
      this.cdr.detectChanges();
    }
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

  get isFiltered(): boolean {
    return this.selectedCategories.length > 0 || this.selectedPriceRanges.length > 0;
  }

  get categories(): string[] {
    return this.allCategories;
  }

  get filteredProducts(): Product[] {
    const source = this.isFiltered && this.allProductsCache
      ? this.allProductsCache
      : this.allProducts;

    let results = [...source];

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
    this.onFilterChange();
  }

  isCategorySelected(cat: string): boolean {
    return this.selectedCategories.includes(cat);
  }

  togglePriceRange(label: string): void {
    const idx = this.selectedPriceRanges.indexOf(label);
    if (idx >= 0) this.selectedPriceRanges.splice(idx, 1);
    else this.selectedPriceRanges.push(label);
    this.onFilterChange();
  }

  isPriceRangeSelected(label: string): boolean {
    return this.selectedPriceRanges.includes(label);
  }

  clearAll(): void {
    this.selectedCategories = [];
    this.selectedPriceRanges = [];
    this.cdr.detectChanges();
  }

  removeCategory(cat: string): void {
    this.selectedCategories = this.selectedCategories.filter((c) => c !== cat);
    this.onFilterChange();
  }

  removePriceRange(label: string): void {
    this.selectedPriceRanges = this.selectedPriceRanges.filter((r) => r !== label);
    this.onFilterChange();
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
