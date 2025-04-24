import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from './menu.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/product-api`;

  constructor(private http: HttpClient) { }

  addProductToMenu(menuId: string, product: Product): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${menuId}/add`, product);
  }

  getProductsByMenu(menuId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/${menuId}`);
  }

  updateProduct(menuId: string, productName: string, product: Product): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${menuId}/${productName}`, product);
  }

  deleteProduct(menuId: string, productName: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${menuId}/${productName}`);
  }
}
