import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Menu {
  id?: string;
  name?: string;
  products?: Product[];
}

export interface Product {
  productName: string;
  description: string;
  price: number;
  menu?: Menu;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = `${environment.apiUrl}/menu-api`;

  constructor(private http: HttpClient) { }

  createMenu(menu: Menu): Observable<Menu> {
    return this.http.post<Menu>(`${this.apiUrl}/create`, menu);
  }

  getAllMenus(): Observable<Menu[]> {
    return this.http.get<Menu[]>(this.apiUrl);
  }

  deleteMenu(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
