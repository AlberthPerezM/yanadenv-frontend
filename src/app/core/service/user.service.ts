import { Injectable } from '@angular/core';
import { Observable, map} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { BACKEND_URL } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: User[] = [];

  private url: string = `${BACKEND_URL}/api/users`;

  constructor(private http: HttpClient) { }

  findAll(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  findAllPageable(page: number): Observable<any> {
    return this.http.get<any[]>(`${this.url}/page/${page}`);
  }

  findById(id: number): Observable<User> {
    return this.http.get<User>(`${this.url}/${id}`);
  }

  create(user: User): Observable<User>{
    return this.http.post<User>(this.url, user);
  }

  update(user: User): Observable<User>{
    return this.http.put<User>(`${this.url}/${user.id}`, user);
  }

  remove(id: number): Observable<number>{
    return this.http.delete<number>(`${this.url}/${id}`).pipe(
      map(() => id)
    );
  }
}
