import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AdminFirebasaeService {

  readonly baseURL = `${environment.baseUrl}/admin`;

  constructor( private http: HttpClient) {
  }

  deleteFBUser(data) {
    return this.http.post<void>(`${this.baseURL}/delete-user/${data._id}`, data);
  }

  disableUser(data) {
    return this.http.post(`${this.baseURL}/disable-enable/${data.firebaseId}`,data);
  }

  deleteAgent(data) {
    return this.http.post(`${this.baseURL}/delete-agent/${data.firebaseId}`,data);
  }
}
