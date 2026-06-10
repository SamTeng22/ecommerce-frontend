import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(data:any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  login(data:any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  getProducts(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.baseUrl}/products?page=${page}&size=${size}`);
  }

  getProduct(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/products/${id}`);
  }

  getCart(): Observable<any> {
    return this.http.get(`${this.baseUrl}/cart`, { headers: this.authHeaders() });
  }

  addToCart(productId: number, quantity: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/cart/items`, {productId, quantity}, {headers: this.authHeaders()})
  }

  removeFromCart(cartItemId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/cart/items/${cartItemId}`, {headers: this.authHeaders()})
  }

  checkout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/orders/checkout`, {}, {headers: this.authHeaders()})
  }

  getOrders(): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders`, {headers: this.authHeaders()})
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categories`);
  }

  //Admin - Products
  createProduct(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/products`, data, {headers: this.authHeaders() });
  }

  updateProduct(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/products/${id}`, data, {headers: this.authHeaders() });
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/products/${id}`, {headers: this.authHeaders() });
  }

  //Admin - Orders
  getAllOrders(): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders/all`, {headers: this.authHeaders() });
  }

  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/orders/${orderId}/status`, { status }, { headers: this.authHeaders() });
  }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}`});
  }
}
