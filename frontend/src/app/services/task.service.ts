import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  _id?: string;
  user: string;
  title: string;
  description?: string;
  urgency: number;
  importance: number;
  priority?: number;
  classification?: 'Alta' | 'Media' | 'Baja';
  critical?: boolean;
  status?: 'Pendiente' | 'En progreso' | 'Completada';
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:4000/api/tasks';

  constructor(private http: HttpClient) {}

  getTasksByUser(userId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/user/${userId}`);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}