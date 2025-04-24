import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private baseUrl = `${environment.apiUrl}/user-api`

  constructor(private http: HttpClient) {}

  // Получение профиля пользователя
  getProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/profile`);
  }

  // Обновление профиля пользователя
  updateProfile(userData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update`, userData);
  }
}
