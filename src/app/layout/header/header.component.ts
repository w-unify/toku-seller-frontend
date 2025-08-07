import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUserName: string | null = null;
  private userSubscription: Subscription | undefined; 

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(userName => {
      this.currentUserName = userName;
    });
  }

  ngOnDestroy(): void {
        this.userSubscription?.unsubscribe();
  }

  /**
   * Método para cerrar la sesión del usuario.
   * Llama al método logout del AuthService y redirige al usuario a la página de login.
   */
  logout(): void {
    this.authService.logout(); 
    this.router.navigate(['/login']);
  }
}
