import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ApiResponse, User, Record,
  CreateUserPayload, UpdateUserPayload
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ─── Auth ─────────────────────────────────────────────────
  login(email: string, password: string): Observable<ApiResponse<{ token: string; user: User }>> {
    return this.http.post<ApiResponse<{ token: string; user: User }>>(
      `${this.api}/auth/login`,
      { email, password }
    );
  }

  // ─── Users (Admin only) ───────────────────────────────────
  getUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.api}/users`);
  }

  createUser(payload: CreateUserPayload): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.api}/users`, payload);
  }

  updateUser(id: number, payload: UpdateUserPayload): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.api}/users/${id}`, payload);
  }

  deleteUser(id: number): Observable<ApiResponse<{ message: string }>> {
    return this.http.delete<ApiResponse<{ message: string }>>(`${this.api}/users/${id}`);
  }

  // ─── Records ──────────────────────────────────────────────
  getRecords(): Observable<ApiResponse<Record[]>> {
    return this.http.get<ApiResponse<Record[]>>(`${this.api}/records`);
  }
}
