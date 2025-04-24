import { Component } from '@angular/core';
import { AuthService } from '../services/auth-service/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [FormsModule, NgIf], // Добавляем CommonModule для *ngIf
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.errorMessage = '';

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (data: any) => {
        if (data && data.token) {
          localStorage.setItem('token', data.token);

          // Правильно извлекаем роли из ответа
          const roles = data.roles?.map((roleObj: any) => roleObj.authority) || [];
          localStorage.setItem('roles', JSON.stringify(roles));

          this.router.navigate(['/']);
        } else {
          this.errorMessage = 'Ошибка авторизации';
        }
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 400) {
          this.errorMessage = err.error.text || err.error || 'Неправильный логин или пароль';
        } else {
          console.error('Ошибка при входе:', err);
          this.errorMessage = 'Произошла ошибка при попытке входа';
        }
      }
    });
  }
  goToRegister() {
    this.router.navigate(['/register']);
  }
}
