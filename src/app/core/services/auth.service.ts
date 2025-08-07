import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

interface LoginPayload {
  username: string;
  password: string;
}

interface UserData {
  id: number;
  username: string;
  name: string;
  lastname: string;
  role: string;
  status: string;
}

interface BackendSuccessResponse {
  status: string;
  statusCode: number;
  message: string;
  data: { user: UserData };
  error: null;
  timestamp: string;
}

interface BackendErrorResponse {
  status: string;
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_BASE_URL = 'http://localhost:3000/toku-admin/v1/auth';
  private isAuthenticatedUser = false;
  private readonly USER_KEY = 'current_user';

  // BehaviorSubject para emitir el nombre de usuario actual
  private _currentUserSubject: BehaviorSubject<string | null>;
  public currentUser$: Observable<string | null>;

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = this.getCurrentUser();
    this.isAuthenticatedUser = !!storedUser;
    this._currentUserSubject = new BehaviorSubject<string | null>(storedUser ? storedUser.name : null);
    this.currentUser$ = this._currentUserSubject.asObservable();
  }

  login(credentials: LoginPayload): Observable<BackendSuccessResponse> {
    return this.http.post<BackendSuccessResponse>(`${this.API_BASE_URL}/login`, credentials).pipe(
      tap(response => {
        if (response.status === 'OK' && response.data?.user) {
          this.isAuthenticatedUser = true;
          this.setCurrentUser(response.data.user);

          this._currentUserSubject.next(response.data.user.name+' '+response.data.user.lastname);
        } else {
          this.isAuthenticatedUser = false;
          this.removeCurrentUser();
          this._currentUserSubject.next(null);
          throw new Error(response.message || 'Respuesta de login no válida.');
        }
      }),
      catchError(this.handleError)
    );
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedUser;
  }

  logout(): void {
    this.isAuthenticatedUser = false;
    this.removeCurrentUser();
    this._currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private setCurrentUser(user: UserData): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getCurrentUser(): UserData | null {
    const userString = localStorage.getItem(this.USER_KEY);
    return userString ? JSON.parse(userString) : null;
  }

  private removeCurrentUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Manejo centralizado de errores para las peticiones HTTP de autenticación.
   * @param error El HttpErrorResponse recibido.
   * @returns Un Observable que emite un Error con un mensaje descriptivo.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido. Inténtalo de nuevo.';

    if (error.error && typeof error.error === 'object') {
      const backendError = error.error as BackendErrorResponse;

      if (backendError.error) {
        errorMessage = backendError.error;
      }
      else if (backendError.message) {
        errorMessage = backendError.message;
      }
    }
    else if (error.error instanceof ErrorEvent) {
      errorMessage = `Error de red o cliente: ${error.error.message}`;
    }
    else {
      if (error.status === 401) {
        errorMessage = 'Las credenciales proporcionadas son incorrectas.';
      } else if (error.status >= 400 && error.status < 500) {
        errorMessage = `Error en la solicitud: Código ${error.status}`;
      } else if (error.status >= 500) {
        errorMessage = `Error del servidor (${error.status}). Por favor, inténtalo más tarde.`;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}
