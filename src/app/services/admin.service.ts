import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Booking } from './booking.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private adminApiUrl = `${environment.apiUrl}/admin-api`;

  constructor(private http: HttpClient) { }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.adminApiUrl}/bookings`);
  }
}
