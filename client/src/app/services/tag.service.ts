import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tag } from '../models/tag';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  private url = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getList(): Observable<Tag[]>
  {
    return this.http.get(`${this.url}/tags`) as Observable<Tag[]>;
  }

  addTag(data: any): Observable<string>
  {
    return this.http.post(`${this.url}/tags`, data) as Observable<string>;
  }

  deleteTag(id: number): Observable<string>
  {
    return this.http.delete(`${this.url}/tags/${id}`) as Observable<string>;
  }

  updateTag({id, ...rest}: any): Observable<string>
  {
    return this.http.put(`${this.url}/tags/${id}`, rest) as Observable<string>;
  }

  getTagById(id: number): Observable<Tag>
  {
    return this.http.get(`${this.url}/tags/${id}`) as Observable<Tag>;
  }


}
