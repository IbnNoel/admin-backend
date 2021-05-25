import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MetricsService {

  readonly baseURL = `${environment.baseUrl}/metrics`;

  
  constructor(private http: HttpClient) { }
  
  getDashMetrics(searchForm) {
    return this.http.get(`${this.baseURL}/dashboard?date=${searchForm.date}`);
  }

}
