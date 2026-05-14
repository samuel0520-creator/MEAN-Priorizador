import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  name = '';
  email = '';

  errorMessage = '';
  loading = false;

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {

    const user = localStorage.getItem('user');

    if (user) {
      this.router.navigate(['/dashboard']);
    }

  }

  login(): void {

    this.errorMessage = '';

    // VALIDAR NOMBRE

    if (!this.name.trim()) {

      this.errorMessage = 'Ingresa tu nombre';

      return;
    }

    // VALIDAR EMAIL

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(this.email)) {

      this.errorMessage =
        'Ingresa un correo válido';

      return;
    }

    this.loading = true;

    this.userService.simpleLogin({
      name: this.name,
      email: this.email
    }).subscribe({

      next: (user) => {

        localStorage.setItem(
          'user',
          JSON.stringify(user)
        );

        this.loading = false;

        this.router.navigate(['/dashboard']);
      },

      error: (error) => {

        this.loading = false;

        this.errorMessage =
          error.error?.error
          ||
          'Error ingresando';
      }

    });
  }
}