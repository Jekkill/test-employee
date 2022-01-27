import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private url = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getList(): Observable<Employee[]>
  {
    return this.http.get(`${this.url}/employees`) as Observable<Employee[]>;
  }

  addEmployee(data: Employee): Observable<string>
  {
    return this.http.post(`${this.url}/employees`, data) as Observable<string>;
  }

  getEmployeeById(id: number): Observable<Employee>
  {
    return this.http.get(`${this.url}/employees/${id}`) as Observable<Employee>;
  }

  editEmployee(data: any): Observable<string>
  {
    return this.http.put(`${this.url}/employees`, data) as Observable<string>;
  }

  deleteEmployee(id: number): Observable<string>
  {
    return this.http.delete(`${this.url}/employees/${id}`) as Observable<string>;
  }
}
