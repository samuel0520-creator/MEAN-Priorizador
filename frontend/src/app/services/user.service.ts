import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AppUser {
  _id: string;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:4000/api/users';

  constructor(private http: HttpClient) {}

  simpleLogin(data: { name: string; email: string }): Observable<AppUser> {
    return this.http.post<AppUser>(`${this.apiUrl}/simple-login`, data);
  }
}