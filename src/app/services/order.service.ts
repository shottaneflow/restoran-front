import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../order.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/order-api`;

  constructor(private http: HttpClient) { }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  getUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/user`);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }
  deleteOrder(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  updateOrder(id: string, order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}`, order);
  }


}
