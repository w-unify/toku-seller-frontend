import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core'; 
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule], 
  templateUrl: './login.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage: string | null = null; 
  passwordVisible: boolean = false;
  constructor(
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef 
  ) { }

  onLogin(): void {
    this.errorMessage = null; 

    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Por favor, introduce tu email y contraseña.';
      this.cdr.detectChanges(); 
      return;
    }

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        console.log('LoginComponent: Login exitoso. Navegando a /dashboard.');
        this.router.navigate(['/dashboard']);
      },
      error: (err: Error) => {
        console.error('LoginComponent: Error durante el login:', err.message);
        this.errorMessage = err.message || 'Ocurrió un error inesperado. Inténtalo de nuevo.';
        console.log('LoginComponent: errorMessage configurado a:', this.errorMessage);
        this.cdr.detectChanges(); 
      }
    });
  }
  
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}