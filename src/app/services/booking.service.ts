import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Booking {
  id?: string;
  date: string; // LocalDateTime из бекенда будет приходить как строка
  guestCount: number; // Заменили tableNumber на guestCount согласно бекенду
  clientId?: string;
  client?: {  // Добавляем опциональное поле для клиента
    id: string;
    username?: string;
    // другие поля клиента при необходимости
  };
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/booking-api`;

  constructor(private http: HttpClient) { }

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  createBooking(booking: Omit<Booking, 'id'>): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/create`, booking);
  }

  updateBooking(id: string, booking: Booking): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/${id}`, booking);
  }

  deleteBooking(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getBookingById(id: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }
}
