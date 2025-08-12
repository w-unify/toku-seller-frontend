import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FooterAuthComponent } from '../footer/footer.component';
import { HeaderAuthComponent } from '../header/header.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, HeaderAuthComponent, FooterAuthComponent],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  formData = {
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    termsAccepted: false,
  };

  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.formData.password !== this.formData.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    if (!this.formData.termsAccepted) {
      this.errorMessage = 'Debes aceptar los Términos y Condiciones.';
      return;
    }

    const payload = {
      name: this.formData.name,
      lastname: this.formData.lastname,
      email: this.formData.email,
      password: this.formData.password,
      phone: this.formData.phone,
    };

    /*this.authService.register(payload).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Error al crear la cuenta.';
      },
    });*/
  }
}
