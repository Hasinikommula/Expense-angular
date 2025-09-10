import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:44331/api/Auth';
  user : any = null;
  constructor(private http: HttpClient, private router: Router) {}

 
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }


  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

 
  register(username: string, email: string, password: string, isAdmin = false): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, email, password, isAdmin });
  }

  
  saveToken(token: string) {
    if (this.isBrowser()) {
      localStorage.setItem('token', token);
    }
  }

 
  getToken(): string | null {
    return this.isBrowser() ? localStorage.getItem('token') : null;
  }

 
  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
    }
    this.router.navigate(['/login']);
    console.log('Logged out successfully');
  }

 
  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token;
  }

    getCurrentUser() {
    try {
      const raw = localStorage.getItem('currentUser');
      if (!raw) return { id: 1, username: 'Demo User' }; 
      return JSON.parse(raw);
    } catch (err) {
      return { id: 1, username: 'Demo User' };
    }
  }
}
