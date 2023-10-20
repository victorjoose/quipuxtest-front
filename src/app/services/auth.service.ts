import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  private token: string | null = null;

  authenticate(username: string, password: string) {
    const apiUrl = 'http://localhost:8080/authenticate';
    const body = { username, password };

    return this.http.post(apiUrl, body, {responseType:'text' as 'json'});
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('jwtToken', token);
  }

  getToken(): string | null {
    if (this.token === null) {
      this.token = localStorage.getItem('jwtToken') || null;
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('jwtToken');
  }

  setAuthorized(authorized: boolean): void {
    localStorage.setItem('authorized', authorized ? 'true' : 'false');
  }
}
