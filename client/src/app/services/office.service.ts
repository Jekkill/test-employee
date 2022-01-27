import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Office } from '../models/office';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OfficeService {

  private url = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getList(): Observable<Office[]>
  {
      return this.http.get(`${this.url}/offices`) as Observable<Office[]>;
  }

  addOffice(data: any): Observable<string>
  {
    return this.http.post(`${this.url}/offices`, data) as Observable<string>;
  }

  deleteOffice(id: number): Observable<string>
  {
    return this.http.delete(`${this.url}/offices/${id}`) as Observable<string>;
  }

  updateOffice({id, ...rest}: any): Observable<string>
  {
    return this.http.put(`${this.url}/offices/${id}`, rest) as Observable<string>;
  }

  getOfficeById(id: number): Observable<Office>
  {
    return this.http.get(`${this.url}/offices/${id}`) as Observable<Office>;
  }

}
