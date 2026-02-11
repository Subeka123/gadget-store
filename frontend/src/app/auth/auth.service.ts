import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  

  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { username, password });
  }

  register(data: { username: string; email: string; password: string }) {
    console.log('Registering user with data:', data);
    return this.http.post<{ message: string }>(`${this.apiUrl}/register`, data);
  }

  getToken() {
    return localStorage.getItem('token');
  }
}