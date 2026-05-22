import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private baseUrl = 'http://localhost:8080/api';

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
    return this.http.post(`${this.baseUrl}/cart/items`, {headers: this.authHeaders()})
  }

  removeFromCart(cartItemId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/cart/items/${cartItemId}`, {headers: this.authHeaders()})
  }

  checkout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/orders/checkout`, {headers: this.authHeaders()})
  }

  getOrders(): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders`, {headers: this.authHeaders()})
  }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}`});
  }
}
