import { Component } from '@angular/core';
import { AuthService } from '../services/auth-service/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    FormsModule,
    NgIf
  ],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.errorMessage = ''; // Сбрасываем предыдущие ошибки

    this.authService.register({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/login']); // Перенаправление на вход
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 400) {
          // Проверяем текст ошибки от сервера
          if (err.error && err.error.includes('уже существует')) {
            this.errorMessage = 'Пользователь с таким логином уже существует';
          } else {
            this.errorMessage = 'Ошибка регистрации: неверные данные';
          }
        } else {
          this.errorMessage = 'Произошла ошибка при регистрации';
        }
        console.error('Registration error:', err);
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
